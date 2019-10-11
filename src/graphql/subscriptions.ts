import gql from "graphql-tag";

export const ON_CREATE_MESSAGE = gql`
  subscription onCreateMessage($chatRoomId: ID!) {
    onCreateMessage(chatRoomId: $chatRoomId) {
      id
      content
      authorId
      chatRoomId
      author {
        id
        username
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
      chatRoomId
      author {
        id
        username
      }
      status
    }
  }
`;
