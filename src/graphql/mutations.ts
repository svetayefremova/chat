import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
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
`;

export const UPDATE_MESSAGE = gql`
  mutation updateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
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
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: String!) {
    deleteMessage(id: $id) {
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
`;

export const CREATE_CHATROOM = gql`
  mutation createChatRoom($input: CreateChatRoomInput!) {
    createChatRoom(input: $input) {
      id
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
      name
      members
    }
  }
`;
