import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";

import {
  CREATE_CHATROOM,
  CREATE_MESSAGE,
  CREATE_USER,
  UPDATE_MESSAGE,
} from "../graphql/mutations";
import { GET_CHATROOM, GET_USER, LIST_USERS } from "../graphql/queries";
import { ON_CREATE_MESSAGE, ON_UPDATE_MESSAGE } from "../graphql/subscriptions";

export interface ICreateMessageInput {
  chatRoomId: string;
  authorId: string;
  content: string;
}

export interface IUpdateMessageInput {
  id: string;
  content: string;
}

export interface ICreateChatRoomInput {
  members: string[];
  name: string;
}

// QUERIES
export const useGetUserQuery = (id) =>
  useQuery(GET_USER, { variables: { id } });

export const useListUsersQuery = () => useQuery(LIST_USERS);

export const useGetChatRoomQuery = (roomId) =>
  useQuery(GET_CHATROOM, { variables: { id: roomId } });

// MUTATIONS
export const useCreateUserMutation = () => {
  const [createUser] = useMutation(CREATE_USER);

  return (username: string) =>
    createUser({
      variables: { input: { username } },
    });
};

export const useCreateChatRoomMutation = (id) => {
  const [createChatRoom] = useMutation(CREATE_CHATROOM, {
    refetchQueries() {
      return [
        {
          query: GET_USER,
          variables: { id },
        },
      ];
    },
  });

  return (id, username, currentUserId) => {
    return createChatRoom({
      variables: {
        input: {
          members: [currentUserId, id],
          name: `Chat with ${username}`,
        },
      },
    });
  };
};

export const useCreateMessageMutation = (roomId) => {
  const [createMessage, { loading, error }] = useMutation(CREATE_MESSAGE, {
    update(cache, { data }) {
      const { getChatRoom } = cache.readQuery({
        query: GET_CHATROOM,
        variables: { id: roomId },
      });
      cache.writeQuery({
        query: GET_CHATROOM,
        data: {
          getChatRoom: {
            ...getChatRoom,
            messages: getChatRoom.messages.concat([data.createMessage]),
          },
        },
      });
    },
  });

  // TODO types definition
  const mutation: any = [
    (input: ICreateMessageInput) => createMessage({ variables: { input } }),
    loading,
    error,
  ];

  return mutation;
};

export const useUpdateMessageMutation = () => {
  const [updateMessage, { loading, error }] = useMutation(UPDATE_MESSAGE);

  // TODO types definition
  const mutation: any = [
    (input: IUpdateMessageInput) => updateMessage({ variables: { input } }),
    loading,
    error,
  ];

  return mutation;
};

// SUBSCRIPTIONS
export const useCreateMessageSubscription = () =>
  useSubscription(ON_CREATE_MESSAGE);

export const useUpdateMessageSubscription = () =>
  useSubscription(ON_UPDATE_MESSAGE);
