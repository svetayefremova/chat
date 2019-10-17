import gql from "graphql-tag";

export const SIGNUP = gql`
  mutation signup($input: AuthInput!) {
    signup(input: $input) {
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

export const LOGIN = gql`
  mutation login($input: AuthInput!) {
    login(input: $input) {
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

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation updateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      id
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;

export const CREATE_CHATROOM = gql`
  mutation createChatRoom($input: CreateChatRoomInput!) {
    createChatRoom(input: $input) {
      id
    }
  }
`;
