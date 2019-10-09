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
      }
      name
      members
    }
  }
`;
