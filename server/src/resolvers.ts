import { PubSub, withFilter } from "apollo-server";
import moment from "moment";

import ChatRoom from "./models/chatRoom";
import Message from "./models/message";
import User from "./models/user";

const pubsub = new PubSub();

enum MessageStatus {
  updated = "updated",
  deleted = "deleted"
}

export const resolvers = {
  User: {
    chatRooms: async ({ id }) => {
      return await ChatRoom.find({ members: id });
    }
  },

  Message: {
    author: async ({ authorId }) => {
      return await User.findById(authorId);
    }
  },

  ChatRoom: {
    messages: async ({ id }) => {
      return await Message.find({ chatRoomId: id });
    }
  },

  Query: {
    listUsers: async () => {
      const users: any[] = await User.find();

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
  },

  Mutation: {
    createUser: async (_, { input }) => {
      let user: any = await User.findOne({
        username: input.username,
      });

      if (!user) {
        user = await User.create({
          ...input,
          createdAt: moment.utc().unix(),
          updatedAt: moment.utc().unix()
        });

        return user.toObject();     
      }
    },

    createMessage: async (_, { input }) => {
      const message = await Message.create({
        ...input,
        status: null,
        createdAt: moment.utc().unix(),
        updatedAt: moment.utc().unix()
      });

      pubsub.publish("onCreateMessage", {
        onCreateMessage: message,
      });

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
       
        return chatRoom.toObject();     
      }
    },
  },

  Subscription: {
    onCreateMessage: {
      subscribe: () => pubsub.asyncIterator("onCreateMessage")
    },

    onUpdateMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("onUpdateMessage"),
        (payload, variables) => payload.onUpdateMessage.id === variables.id
      )
    },
  },
};
