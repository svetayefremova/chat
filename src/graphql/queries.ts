import gql from "graphql-tag";

export const CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
      chatRooms {
        id
        name
        members
        messages {
          id
          content
          isRead
          authorId
          chatRoomId
          createdAt
          updatedAt
        }
        isGroupChat
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      chatRooms {
        id
        name
        members
        messages {
          id
          content
          isRead
          authorId
          chatRoomId
          createdAt
          updatedAt
        }
        isGroupChat
        createdAt
        updatedAt
      }
    }
  }
`;

export const LIST_USERS = gql`
  query listUsers($first: Int, $skip: Int) {
    listUsers(first: $first, skip: $skip) {
      id
      username
    }
  }
`;

// TODO maybe not need
export const GET_CHATROOM = gql`
  query getChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
    }
  }
`;

export const GET_MESSAGES = gql`
  query getMessages(
    $chatRoomId: ID!
    $first: Int
    $skip: Int
    $filter: MessageFilter
  ) {
    getMessages(
      chatRoomId: $chatRoomId
      first: $first
      skip: $skip
      filter: $filter
    ) {
      id
      content
      author {
        id
        username
      }
      authorId
      chatRoomId
      chatRoom {
        id
        name
        members
        messages {
          id
          content
        }
        isGroupChat
        createdAt
        updatedAt
      }
      status
      isRead
      createdAt
      updatedAt
    }
  }
`;
