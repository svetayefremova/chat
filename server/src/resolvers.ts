import { PubSub, withFilter } from "apollo-server";
import moment from "moment";
import GQLMongoQuery from '@konfy/graphql-mongo-query';

import ChatRoom from "./models/chatRoom";
import Message from "./models/message";
import User from "./models/user";

const pubsub = new PubSub();
const parser = new GQLMongoQuery()

enum MessageStatus {
  sent = "sent",
  updated = "updated",
  deleted = "deleted"
}

enum Notifications {
  NEW_MESSAGE = "NEW_MESSAGE",
  UPDATED_MESSAGE = "UPDATED_MESSAGE",
  DELETED_MESSAGE = "DELETED_MESSAGE"
}

const notifications = [];

export const resolvers = {
  User: {
    chatRooms: async ({ id }) => {
      return await ChatRoom.find({ members: id }).sort({"updatedAt": "desc"});
    }
  },

  Message: {
    author: async ({ authorId }) => {
      return await User.findById(authorId);
    },
    chatRoom: async ({ chatRoomId }) => {
      return await ChatRoom.findById(chatRoomId);
    }
  },

  ChatRoom: {
    messages: async ({ id }) => {
      return await Message.find({ chatRoomId: id });
    }
  },

  Query: {
    currentUser: (_, {}, context) => context.getUser(),

    listUsers: async (_, { first, skip }) => {
      const users: any[] = await User.find()
        .limit(first)
        .skip(skip);

      return users.map(user => user.toObject());
    },

    getUser: async (_, { id }) => {
      const user: any = await User.findById(id);

      if (user) {
        return user.toObject();
      }
    },

    getChatRoom: async (_, { id }) => {
      const chatRoom: any = await ChatRoom.findById(id);

      if (chatRoom) {
        return chatRoom.toObject();
      }
    },

    getMessages: async (_, { chatRoomId, filter, first, skip }) => {
      const filters = parser.buildFilters(filter)
      const messages = await Message.find({ chatRoomId, ...filters })
        .sort({"createdAt": "desc"})
        .limit(first)
        .skip(skip);
    
      return messages.map(message => message.toObject());
    },

    getNotifications: async () => notifications,
  },

  Mutation: {
    signup: async (_, { input }, context) => {
      let user: any = await User.findOne({
        username: input.username,
      });

      if (user) {
        throw new Error("User with username already exists");
      }

      user = await User.create({
        ...input,
        createdAt: moment.utc().unix(),
        updatedAt: moment.utc().unix()
      });

      context.login(user);

      return user.toObject();     
    },

    logout: (_, {}, context) => context.logout(),

    login: async (_, { input }, context) => {
      const { user } = await context.authenticate("graphql-local", {
        username: input.username, password: input.password
      });
      context.login(user);
      return user;
    },

    createMessage: async (_, { input }) => {
      const message = await Message.create({
        ...input,
        isRead: false,
        status: MessageStatus.sent,
        createdAt: moment.utc().unix(),
        updatedAt: moment.utc().unix()
      });

      await ChatRoom.findByIdAndUpdate(input.chatRoomId,
        {
          updatedAt: moment.utc().unix(),
        }, {
          upsert: true,
          new: true
        }
      );

      pubsub.publish("onCreateMessage", {
        onCreateMessage: message,
      });

      pubsub.publish("newNotification", {
        newNotification: {
          type: Notifications.NEW_MESSAGE,
          payload: JSON.stringify(message)
        }
      });

      console.log(message);
  
      return message.toObject();
    },

    updateMessage: async (_, { input }) => {
      const message = await Message.findByIdAndUpdate(input.id,
        {
          content: input.content || "",
          status: input.status || MessageStatus.updated,
          updatedAt: moment.utc().unix(),
        }, {
          upsert: true,
          new: true
        }
      );

      pubsub.publish("onUpdateMessage", {
        onUpdateMessage: message
      });

      return message.toObject();
    },
  
    createChatRoom: async (_, { input }) => {
      let chatRoom: any = await ChatRoom.findOne({
        members: input.members,
      });

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          ...input,
          createdAt: moment.utc().unix(),
          updatedAt: moment.utc().unix()
        });
      }

      return chatRoom.toObject();  
    },

    markAsRead: async (_, { input: { chatRoomId, userId } }) => {
      const messages = await Message.updateMany(
        { chatRoomId, authorId: { $ne: userId } },
        { isRead: true }
      )

      console.log('messages', messages)
    }
  },

  Subscription: {
    onCreateMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("onCreateMessage"),
        (payload, variables) => payload.onCreateMessage.chatRoomId === variables.chatRoomId
      )
    },

    onUpdateMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("onUpdateMessage"),
        (payload, variables) => payload.onUpdateMessage.id === variables.id
      )
    },

    // rename to newDMNotification
    newNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("newNotification"),
        async (payload, variables) => {
          const message = JSON.parse(payload.newNotification.payload);
          const chatRoom = await ChatRoom.findById(message.chatRoomId);
          return chatRoom.members
            .some(memberId => memberId === variables.userId);
        }
      )
    },

  },
};
