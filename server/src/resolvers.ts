import { PubSub, withFilter } from "apollo-server";
import uuid from "uuidv4";

import { USER } from "../../src/config";
// import Message from './models/message';
import ChatRoom from "./models/chatRoom";
import User from "./models/user";

const pubsub = new PubSub();

// example data
const messages = [
  {
    id: "1",
    author: {
      id: "1",
      username: "Svieta",
    },
    authorId: "1",
    content: "hello alice",
    chatRoomId: "1",
    status: null
  },
  {
    id: "2",
    author: {
      id: "2",
      username: "Alice",
    },
    authorId: "2",
    content: "hello Svieta",
    chatRoomId: "1",
    status: null
  },
];
const chatRooms = [
  {
    id: "1",
    messages,
    name: "Chat 1",
    members: ["Svieta", "Alice"],
  },
];

enum MessageStatus {
  updated = "updated", deleted = "deleted"
}

export const resolvers = {
  Query: {
    listUsers: async () => {
      const users: any[] = await User.find();

      return users.map(user => user.toObject());

      // return users;
    },

    getUser: async (_, { id }) => {
      const user: any = await User.findById(id);

      if (user) {
        return user.toObject();
      }

      // return users.find((user) => user.id === id);
    },

    getChatRoom: async (_, { id }) => {
      const chatRoom: any = await ChatRoom.findById(id);

      if (chatRoom) {
        return chatRoom.toObject();
      }

      // return chatRooms.find((chatRoom) => chatRoom.id === id);
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
          createdAt: Date.now(),
          updatedAt: Date.now()
        });

        return user.toObject();     
      }
    },

    createMessage: async (_, { input }) => {
      const message = {
        id: uuid(),
        content: input.content,
        authorId: input.authorId,
        chatRoomId: input.chatRoomId,
        author: USER,
        status: null
      };

      messages.push(message);

      pubsub.publish("onCreateMessage", {
        onCreateMessage: message,
      });

      return message;
    },

    updateMessage: async (_, { input }) => {
      messages.map(message => {
        if (message.id === input.id) {
          message.content = input.content || "",
          message.status = input.status || MessageStatus.updated;
        }
        return message;
      });

      const message = messages.find(message => message.id === input.id);

      console.log("message", message);

      pubsub.publish("onUpdateMessage", {
        onUpdateMessage: message
      });

      return message;
    },
  
    createChatRoom: async (_, { input }) => {
      const chat = {
        id: uuid(),
        members: input.members,
        name: input.name,
        messages: [],
      };

      chatRooms.push(chat);

      return chat;
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
