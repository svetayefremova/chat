import uuid from "uuidv4";

import { USER } from "../../src/config";
import pubsub from "./pubsub";

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
const users = [
  { id: "1", username: "Svieta", chatRooms },
  { id: "2", username: "Alice", chatRooms },
  { id: "3", username: "Marianna", chatRooms: null },
];

export const resolvers = {
  Query: {
    listUsers: async () => {
      // const users: any[] = await User.find()

      // return users.map(user => user.toObject())
      return users;
    },

    getUser: async (_, { id }) => {
      // const user: any = await User.findById(id)

      // if (user) {
      //   return user.toObject()
      // }

      return users.find((user) => user.id === id);
    },

    getChatRoom: async (_, { id }) => {
      return chatRooms.find((chatRoom) => chatRoom.id === id);
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      // let user: any = await User.findOne({
      //   username: args.username,
      // })

      // if (!user) {
      //   user = await User.create(args)

      //   return user.toObject()
      // }
      const user = {
        id: uuid(),
        username: input.username,
        chatRooms: [],
      };

      users.push(user);
    },

    createMessage: async (_, { input }) => {
      const message = {
        id: uuid(),
        content: input.content,
        authorId: input.authorId,
        chatRoomId: input.chatRoomId,
        author: USER,
      };

      messages.push(message);

      pubsub.publish("onCreateMessage", {
        onCreateMessage: message,
      });

      return message;
    },

    deleteMessage: (_, { id }) => true,

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
  },
};
