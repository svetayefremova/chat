import gql from "graphql-tag";

export const ON_CREATE_MESSAGE = gql`
  subscription onCreateMessage($chatRoomId: ID!) {
    onCreateMessage(chatRoomId: $chatRoomId) {
      id
      content
      authorId
      author {
        id
        username
      }
      chatRoomId
      chatRoom {
        id
        name
        members
        messages {
          id
          content
          isRead
        }
        isGroupChat
        createdAt
        updatedAt
      }
      status
      createdAt
      updatedAt
    }
  }
`;

export const ON_UPDATE_MESSAGE = gql`
  subscription onUpdateMessage($id: ID!) {
    onUpdateMessage(id: $id) {
      id
      content
      authorId
      author {
        id
        username
      }
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

export const NEW_NOTIFICATION = gql`
  subscription newNotification($userId: ID!) {
    newNotification(userId: $userId) {
      type
      payload
    }
  }
`;
