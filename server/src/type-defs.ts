import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    chatRooms: [ChatRoom]
    createdAt: String
    updatedAt: String
  }

  type Message {
    id: ID!
    author: User
    authorId: ID!
    content: String!
    chatRoomId: ID!
    createdAt: String
    updatedAt: String
    status: String
  }

  type ChatRoom {
    id: ID!
    messages: [Message]
    name: String!
    members: [String!]!
    createdAt: String
    updatedAt: String
  }

  # the schema allows the following query:
  type Query {
    listUsers: [User]
    getUser(id: ID!): User
    getChatRoom(id: ID!): ChatRoom
  }

  # the schema allows the following mutation:
  input CreateUserInput {
    username: String!
  }

  input CreateMessageInput {
    chatRoomId: ID!
    authorId: ID!
    content: String!
  }

  input UpdateMessageInput {
    id: ID!
    content: String
    status: String
  }

  input CreateChatRoomInput {
    members: [String!]!
    name: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    createMessage(input: CreateMessageInput!): Message
    updateMessage(input: UpdateMessageInput!): Message
    createChatRoom(input: CreateChatRoomInput!): ChatRoom
  }

  # the schema allows the following subscription:
  type Subscription {
    onCreateMessage(chatRoomId: ID!): Message
    onUpdateMessage(id: ID!): Message
  }
`;
