import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { USER } from "../config";
import { CREATE_MESSAGE } from "../graphql/mutations";
import { GET_CHATROOM } from "../graphql/queries";
import { ON_CREATE_MESSAGE } from "../graphql/subscriptions";

// TODO split code into components

interface ICreateMessageInput {
  chatRoomId: string;
  authorId: string;
  content: string;
}

const useGetChatRoomQuery = (roomId) =>
  useQuery(GET_CHATROOM, { variables: { id: roomId } });
const useCreateMessageMutation = (roomId) => {
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
const useCreateMessageSubscription = () => useSubscription(ON_CREATE_MESSAGE);

const CreateMessage = ({ roomId }) => {
  useCreateMessageSubscription();
  const [message, setMessage] = useState("");
  const [mutate, loading, error] = useCreateMessageMutation(roomId);

  async function create(e: React.KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (message === "") {
      return;
    }

    const createMessageInput: ICreateMessageInput = {
      content: message,
      authorId: USER.id,
      chatRoomId: roomId,
    };

    await mutate(createMessageInput);

    setMessage("");
  }

  return (
    <div>
      <input
        name="message"
        placeholder="Type your message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => create(e)}
        value={message}
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </div>
  );
};

const Messages = ({ roomId }) => {
  const { loading, data, subscribeToMore } = useGetChatRoomQuery(roomId);

  useEffect(() => {
    subscribeToMore({
      document: ON_CREATE_MESSAGE,
      variables: { chatRoomId: roomId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) { return prev; }

        const newMessageItem = subscriptionData.data.onCreateMessage;

        return Object.assign({}, prev, {
          getChatRoom: {
            ...prev.getChatRoom,
            messages: [...prev.getChatRoom.messages, newMessageItem],
          },
        });
      },
    });
  }, [subscribeToMore]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRoom = data && data.getChatRoom;
  const { name, messages } = chatRoom;

  return messages.map(({ id, content, author }) => {
    return (
      <div key={id}>
        <p>
          {author.username}: {content}
        </p>
      </div>
    );
  });
};

const ChatRoomMessages = () => {
  const { chatId } = useParams();

  // TODO should be another logic
  // maybe open first chat by default with bot user?
  if (!chatId) {
    return <p>Start to chat with somebody</p>;
  }

  return (
    <div>
      <p>Chat: {chatId}</p>
      <Messages roomId={chatId} />
      <CreateMessage roomId={chatId} />
    </div>
  );
};

export default ChatRoomMessages;
