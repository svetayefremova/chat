import gql from "graphql-tag";

export const typeDefs = gql`
  enum MessageStatus {
    sent
    deleted
    updated
  }


  # searchable inputs 
  input BooleanFilterInput {
    _EQ: Boolean
    _NE: Boolean
  }

  input StringFilterInput {
    _EQ: String
    _NE: String
    _IN: [String]
  }

  # filters inputs
  input MessageFilter {
    isRead: BooleanFilterInput
    authorId: StringFilterInput
  }


  # mutation inputs
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
    name: String
    isGroupChat: Boolean!
  }

  input AuthInput {
    username: String!
    password: String!
  }

  input MarkAsReadInput {
    chatRoomId: ID!
    userId: ID!
  }

  
  # model types
  type User {
    id: ID!
    username: String!
    password: String!
    chatRooms: [ChatRoom]
    createdAt: Int
    updatedAt: Int
  }

  type Message {
    id: ID!
    author: User
    authorId: ID!
    status: MessageStatus
    isRead: Boolean
    content: String!
    chatRoomId: ID!
    chatRoom: ChatRoom
    createdAt: Int
    updatedAt: Int
  }

  type ChatRoom {
    id: ID!
    messages: [Message]
    name: String
    members: [String!]!
    isGroupChat: Boolean
    createdAt: Int
    updatedAt: Int
  }

  type Notification {
    type: String
    payload: String
  }


  # the schema allows the following query:
  type Query {
    currentUser: User
    listUsers(skip: Int, first: Int): [User]
    getUser(id: ID!): User
    getChatRoom(id: ID!): ChatRoom
    getMessages(chatRoomId: ID!, skip: Int, first: Int, filter: MessageFilter): [Message]
    getNotifications: [Notification]
  }


  # the schema allows the following mutation:
  type Mutation {
    signup(input: AuthInput): User
    login(input: AuthInput): User
    logout: Boolean
    createMessage(input: CreateMessageInput!): Message
    updateMessage(input: UpdateMessageInput!): Message
    createChatRoom(input: CreateChatRoomInput!): ChatRoom
    markAsRead(input: MarkAsReadInput!): [Message]
  }


  # the schema allows the following subscription:
  type Subscription {
    onCreateMessage(chatRoomId: ID!): Message
    onUpdateMessage(id: ID!): Message
    newNotification(userId: ID!): Notification
  }
`;
