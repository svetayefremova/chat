import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    """
    the list of ChatRooms by this user
    """
    chatRooms: [ChatRoom]
    createdAt: String
    updatedAt: String
  }

  type Message {
    id: String!
    author: User
    authorId: String!
    content: String!
    chatRoomId: String!
    createdAt: String
    updatedAt: String
    status: String
  }

  type ChatRoom {
    id: String!
    messages: [Message]
    name: String!
    members: [String!]!
    createdAt: String
    updatedAt: String
  }

  # the schema allows the following query:
  type Query {
    listUsers: [User]

    getUser(id: String!): User

    getChatRoom(id: String!): ChatRoom
  }

  # the schema allows the following mutation:
  input CreateUserInput {
    username: String!
  }

  input CreateMessageInput {
    chatRoomId: String!
    authorId: String!
    content: String!
  }

  input UpdateMessageInput {
    id: String!
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
    onCreateMessage(chatRoomId: String!): Message
    
    onUpdateMessage(id: String!): Message
  }
`;
