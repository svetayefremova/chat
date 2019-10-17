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
        }
        isGroupChat
      }
      status
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
      }
      status
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
