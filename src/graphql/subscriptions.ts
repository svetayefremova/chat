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
    }
  }
`;
