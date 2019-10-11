import gql from "graphql-tag";

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      chatRooms {
        id
        name
      }
    }
  }
`;
export const LIST_USERS = gql`
  query {
    listUsers {
      id
      username
    }
  }
`;

export const GET_CHATROOM = gql`
  query getChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
      messages {
        id
        content
        author {
          id
          username
        }
        authorId
        chatRoomId
        status
      }
    }
  }
`;
