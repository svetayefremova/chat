import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ON_CREATE_MESSAGE, ON_UPDATE_MESSAGE } from "../graphql/subscriptions";
import {
  useCreateMessageSubscription,
  useGetChatRoomQuery,
  useUpdateMessageMutation,
  useUpdateMessageSubscription,
} from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";

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

const Message = ({
  message: { id, content, author, authorId, status },
  subscribeToMore,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState();
  const { userId } = useStore();
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

  if (authorId !== userId) {
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

        if (newMessageItem.chatRoomId === prev.getChatRoom.id) {
          const prevChatRoomMessages = prev.getChatRoom.messages.filter(
            (message) => message.id !== data.onCreateMessage.id,
          );

          return Object.assign({}, prev, {
            getChatRoom: {
              ...prev.getChatRoom,
              messages: [...prevChatRoomMessages, newMessageItem],
            },
          });
        }
      },
    });
  }, [subscribeToMore, roomId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRoom = data && data.getChatRoom;
  const { messages } = chatRoom;

  if (!messages || !messages.length) {
    return <p>There are no messages yet</p>;
  }

  return messages.map((message) => (
    <div key={message.id} style={styles.messageContent}>
      <Message message={message} subscribeToMore={subscribeToMore} />
    </div>
  ));
};

const ChatRoomMessages = observer(() => {
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
});

export default ChatRoomMessages;
