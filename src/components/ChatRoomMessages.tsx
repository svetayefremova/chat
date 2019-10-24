import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

import { ON_CREATE_MESSAGE, ON_UPDATE_MESSAGE } from "../graphql/subscriptions";
import {
  useCreateMessageSubscription,
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useUpdateMessageSubscription,
} from "../hooks/hooks";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useStore } from "../stores/store";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";

const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column-reverse",
    maxHeight: 300,
    overflow: "auto",
  },
  messages: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
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
    const unsubscribe = subscribeToMore({
      document: ON_UPDATE_MESSAGE,
      variables: { id },
      updateQuery: (prev) => prev,
    });

    return () => unsubscribe();
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
  const { loading, data, subscribeToMore, fetchMore } = useGetMessagesQuery(
    roomId
  );
  const { setIsFetching, handleScroll } = useInfiniteScroll(onLoadMore);

  useEffect(() => {
    subscribeToMore({
      document: ON_CREATE_MESSAGE,
      variables: { chatRoomId: roomId },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) {
          return prev;
        }

        const newMessageItem = data.onCreateMessage;

        if (
          !prev.getMessages.length ||
          newMessageItem.chatRoomId === prev.getMessages[0].chatRoomId
        ) {
          const prevMessages = prev.getMessages.filter(
            (message) => message.id !== data.onCreateMessage.id,
          );

          return Object.assign({}, prev, {
            getMessages: [newMessageItem, ...prevMessages],
          });
        }
      },
    });
  }, [subscribeToMore, roomId]);

  function onLoadMore() {
    fetchMore({
      variables: {
        skip: data.getMessages.length,
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        setIsFetching(false);

        return Object.assign({}, prev, {
          getMessages: [...prev.getMessages, ...fetchMoreResult.getMessages],
        });
      },
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const messages = data && data.getMessages;

  if (!messages || !messages.length) {
    return <p>There are no messages yet</p>;
  }

  return (
    <div style={styles.messages} onScroll={(e) => handleScroll(e)}>
      <div style={styles.container}>
        {messages.map((message) => (
          <div key={message.id} style={styles.messageContent}>
            <Message message={message} subscribeToMore={subscribeToMore} />
          </div>
        ))}
      </div>
    </div>
  );
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
