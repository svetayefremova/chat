import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";

import {
  CREATE_CHATROOM,
  CREATE_MESSAGE,
  LOGIN,
  LOGOUT,
  SIGNUP,
  UPDATE_MESSAGE,
} from "../graphql/mutations";
import {
  CURRENT_USER,
  GET_CHATROOM,
  GET_NOTIFICATIONS,
  GET_USER,
  LIST_USERS,
} from "../graphql/queries";
import {
  NEW_NOTIFICATION,
  ON_CREATE_MESSAGE,
  ON_UPDATE_MESSAGE,
} from "../graphql/subscriptions";

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
  isGroupChat: boolean;
}

// QUERIES
export const useCurrentUserQuery = () => useQuery(CURRENT_USER);

export const useGetUserQuery = (id) =>
  useQuery(GET_USER, { variables: { id } });

export const useListUsersQuery = () => useQuery(LIST_USERS);

export const useGetChatRoomQuery = (roomId) =>
  useQuery(GET_CHATROOM, { variables: { id: roomId } });

export const useGetNotificationsQuery = () => useQuery(GET_NOTIFICATIONS);

// MUTATIONS
export const useSignUpMutation = () => {
  const [signup] = useMutation(SIGNUP, {
    update(cache, { data: { signup } }) {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: signup },
      });
    },
  });

  return (username: string, password: string) =>
    signup({
      variables: { input: { username, password } },
    });
};

export const useLogoutMutation = () => {
  const [logout] = useMutation(LOGOUT, {
    update(cache) {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: null },
      });
    },
  });

  return () => logout();
};

export const useLoginMutation = () => {
  const [login] = useMutation(LOGIN, {
    update(cache, { data: { login } }) {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: login },
      });
    },
  });

  return (username: string, password: string) =>
    login({
      variables: { input: { username, password } },
    });
};

export const useCreateChatRoomMutation = () => {
  const [createChatRoom] = useMutation(CREATE_CHATROOM, {
    refetchQueries() {
      return [{ query: CURRENT_USER }];
    },
  });

  return (users: string[]) => {
    // TODO divide login for group chat
    const members = users.sort();
    return createChatRoom({
      variables: {
        input: {
          members,
          name: users.length > 2 ? "Group Chat" : "", // name for group chats
          isGroupChat: users.length > 2 ? true : false,
        },
      },
    });
  };
};

export const useCreateMessageMutation = (roomId) => {
  const [createMessage, { loading, error }] = useMutation(CREATE_MESSAGE, {
    refetchQueries() {
      return [{ query: GET_CHATROOM, variables: { id: roomId } }];
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

export const useNewNotificationSubscription = (userId) =>
  useSubscription(NEW_NOTIFICATION, {
    variables: { userId },
  });
