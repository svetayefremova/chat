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
        }
        isGroupChat
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
        }
        isGroupChat
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
  }
`;

export const GET_NOTIFICATIONS = gql`
  query {
    getNotifications {
      label
    }
  }
`;
