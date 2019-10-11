import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";

import { USER } from "../config";
import { CREATE_MESSAGE, UPDATE_MESSAGE } from "../graphql/mutations";
import { GET_CHATROOM } from "../graphql/queries";
import { ON_CREATE_MESSAGE, ON_UPDATE_MESSAGE } from "../graphql/subscriptions";
import { useStore } from "../stores/store";

const styles: any = {
  messageContent: {
    marginTop: 20,
  },
  messageItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "lightyellow",
    paddingLeft: 20,
    paddingRight: 20,
  },
  messageItemUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "lightgray",
    paddingLeft: 20,
    paddingRight: 20,
  },
  editButton: {
    marginLeft: 10,
    border: 0,
    backgroundColor: "none",
    height: 28,
  },
  updateInput: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  typeInput: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffeeff",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 20,
    padding: 12,
    width: "100%",
  },
};
// TODO split code into components

interface ICreateMessageInput {
  chatRoomId: string;
  authorId: string;
  content: string;
}

interface IUpdateMessageInput {
  id: string;
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
const useUpdateMessageMutation = () => {
  const [updateMessage, { loading, error }] = useMutation(UPDATE_MESSAGE);

  // TODO types definition
  const mutation: any = [
    (input: IUpdateMessageInput) => updateMessage({ variables: { input } }),
    loading,
    error,
  ];

  return mutation;
};
const useCreateMessageSubscription = () => useSubscription(ON_CREATE_MESSAGE);
const useUpdateMessageSubscription = () => useSubscription(ON_UPDATE_MESSAGE);

const CreateMessage = ({ roomId }) => {
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
    <div style={styles.typeInput}>
      <input
        name="message"
        placeholder="Type your message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => create(e)}
        value={message}
        style={styles.input}
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </div>
  );
};

const UpdateMessage = ({ message, onClose }) => {
  const [content, setContent] = useState(message.content);
  const [mutate, loading, error] = useUpdateMessageMutation();

  async function update(e: React.KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (content === "") {
      onClose();
      return;
    }

    const updateMessageInput: IUpdateMessageInput = {
      content,
      id: message.id,
    };

    await mutate(updateMessageInput);
    onClose();
  }

  return (
    <div style={styles.updateInput}>
      <input
        name="message"
        placeholder="Type your message"
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => update(e)}
        value={content}
        style={styles.input}
      />
      <button onClick={onClose}>X</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </div>
  );
};

const Message = ({
  message: { id, content, author, authorId, status },
  subscribeToMore,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState();
  const [mutate] = useUpdateMessageMutation();

  useEffect(() => {
    subscribeToMore({
      document: ON_UPDATE_MESSAGE,
      variables: { id },
      updateQuery: (prev) => prev,
    });
  }, [subscribeToMore, id]);

  function onStartEditMessage(id: string) {
    setIsEditMode(!isEditMode);
    setSelectedMessageId(id);
  }

  function onFinishEditMessage() {
    setIsEditMode(!isEditMode);
    setSelectedMessageId(null);
  }

  if (authorId !== USER.id) {
    return (
      <div style={styles.messageItem}>
        <p style={styles.message}>
          {author.username}: {content}
        </p>
      </div>
    );
  }

  if (status === "deleted") {
    return (
      <div style={styles.messageItemUser}>
        <p>Deleted</p>
      </div>
    );
  }

  return (
    <div key={id}>
      {isEditMode && selectedMessageId === id ? (
        <UpdateMessage
          message={{ id, content }}
          onClose={() => onFinishEditMessage()}
        />
      ) : (
        <div
          style={styles.messageItemUser}
          onDoubleClick={() => onStartEditMessage(id)}
        >
          <p style={styles.message}>
            {author.username}: {content}
          </p>
          <button
            onClick={() => onStartEditMessage(id)}
            style={styles.editButton}
          >
            Edit
          </button>
          <button
            onClick={() => mutate({ id, status: "deleted" })}
            style={styles.editButton}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

const Messages = ({ roomId }) => {
  useCreateMessageSubscription();
  useUpdateMessageSubscription();
  const { loading, data, subscribeToMore } = useGetChatRoomQuery(roomId);

  useEffect(() => {
    subscribeToMore({
      document: ON_CREATE_MESSAGE,
      variables: { chatRoomId: roomId },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) {
          return prev;
        }

        const newMessageItem = data.onCreateMessage;
        const prevChatRoomMessages = prev.getChatRoom.messages.filter(
          (message) => message.id !== data.onCreateMessage.id,
        );

        return Object.assign({}, prev, {
          getChatRoom: {
            ...prev.getChatRoom,
            messages: [...prevChatRoomMessages, newMessageItem],
          },
        });
      },
    });
  }, [subscribeToMore, roomId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRoom = data && data.getChatRoom;
  const { messages } = chatRoom;

  return messages.map((message) => (
    <div key={message.id} style={styles.messageContent}>
      <Message message={message} subscribeToMore={subscribeToMore} />
    </div>
  ));
};

const ChatRoomMessages = () => {
  const { currentChatId } = useStore();

  // TODO should be another logic
  // maybe open first chat by default with bot user?
  if (!currentChatId) {
    return <p>Start to chat with somebody</p>;
  }

  return (
    <div>
      <p>Chat: {currentChatId}</p>
      <Messages roomId={currentChatId} />
      <CreateMessage roomId={currentChatId} />
    </div>
  );
};

export default ChatRoomMessages;
