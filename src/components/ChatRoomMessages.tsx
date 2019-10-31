/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdCreate } from "react-icons/io";

import { ON_CREATE_MESSAGE, ON_UPDATE_MESSAGE } from "../graphql/subscriptions";
import {
  useCreateMessageSubscription,
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useUpdateMessageSubscription,
} from "../hooks/hooks";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useStore } from "../stores/store";
import {
  Center,
  Column,
  MessageContent,
  MessageItem,
  Row,
  ScrollContainer,
  Text,
  theme,
} from "../theme";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";
import UserAvatar from "./UserAvatar";

// TODO split code into components
enum MessageStatus {
  sent = "sent",
  updated = "updated",
  deleted = "deleted",
}

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
      <MessageItem align="flex-start">
        <Text paddingVertical="1rem" paddingHorizontal="2.8rem">
          {author.username}
        </Text>
        <Row>
          <UserAvatar username={author.username} />
          <MessageContent backgroundColor={theme.colors.primary}>
            <Text light>
              {status === MessageStatus.deleted ? "Deleted" : content}
            </Text>
          </MessageContent>
        </Row>
      </MessageItem>
    );
  }

  return (
    <>
      {isEditMode && selectedMessageId === id ? (
        <UpdateMessage
          message={{ id, content }}
          onClose={() => onFinishEditMessage()}
        />
      ) : (
        <MessageItem
          align="flex-end"
          key={id}
          onDoubleClick={() => onStartEditMessage(id)}
        >
          <Text paddingVertical="1rem" paddingHorizontal="2.8rem">
            {author.username}
          </Text>
          <Row
            css={css`
              justify-content: flex-end;
            `}
          >
            <MessageContent backgroundColor="white">
              <Text>
                {status === MessageStatus.deleted ? "Deleted" : content}
              </Text>
              {status !== MessageStatus.deleted && (
                <Column align="center" justify="flex-start">
                  <button
                    onClick={() => onStartEditMessage(id)}
                    css={styles.editButton}
                  >
                    <IoMdCreate
                      color={theme.colors.baseFontColor}
                      size={theme.fonts.iconSizeSmall}
                    />
                  </button>
                  <button
                    onClick={() =>
                      mutate({ id, status: MessageStatus.deleted })
                    }
                    css={styles.editButton}
                  >
                    <IoMdClose
                      color={theme.colors.baseFontColor}
                      size={theme.fonts.iconSizeSmall}
                    />
                  </button>
                </Column>
              )}
            </MessageContent>
            <UserAvatar username={author.username} />
          </Row>
        </MessageItem>
      )}
    </>
  );
};

const Messages = ({ roomId }) => {
  useCreateMessageSubscription();
  useUpdateMessageSubscription();
  const { loading, data, subscribeToMore, fetchMore } = useGetMessagesQuery(
    roomId,
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
    return <Text>Loading...</Text>;
  }

  const messages = data && data.getMessages;

  if (!messages || !messages.length) {
    return (
      <Center>
        <Text>There are no messages yet</Text>
      </Center>
    );
  }

  return (
    <ScrollContainer
      css={styles.messagesContainer}
      onScroll={(e) => handleScroll(e)}
    >
      {messages.map((message) => (
        <div key={message.id} css={styles.messageContent}>
          <Message message={message} subscribeToMore={subscribeToMore} />
        </div>
      ))}
    </ScrollContainer>
  );
};

const ChatRoomMessages = observer(() => {
  const { currentChatId } = useStore();

  // TODO should be another logic
  // maybe open first chat by default with bot user?
  if (!currentChatId) {
    return (
      <Center css={styles.emptyContainer}>
        <Text>Start to chat with somebody</Text>
      </Center>
    );
  }

  return (
    <Center>
      <Text>Chat: {currentChatId}</Text>
      <div css={styles.container}>
        <Messages roomId={currentChatId} />
      </div>
      <CreateMessage roomId={currentChatId} />
    </Center>
  );
});

const styles = {
  container: css`
    height: calc(100vh - 190px);
    width: 100%;
  `,
  emptyContainer: css`
    height: 100%;
  `,
  messagesContainer: css`
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
  `,
  messages: css`
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
  `,
  messageContent: css`
    display: flex;
    align-self: stretch;
  `,
  editButton: css`
    margin-left: 0.6rem;
    border: 0;
    height: 1.5rem;
  `,
  updateInput: css`
    margin-top: 1rem;
    display: flex;
    flex: 1;
    justify-content: flex-end;
  `,
  typeInput: css`
    margin-top: 1rem;
    padding: 1rem;
    background-color: ${theme.colors.primary};
    display: flex;
    flex: 1;
    justify-content: center;
  `,
  input: css`
    height: 1.1rem;
    padding: 0.8rem;
    width: 100%;
  `,
};

export default ChatRoomMessages;
