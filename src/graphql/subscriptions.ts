import gql from "graphql-tag";

export const ON_CREATE_MESSAGE = gql`
  subscription onCreateMessage($chatRoomId: String!) {
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
  subscription onUpdateMessage($id: String!) {
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