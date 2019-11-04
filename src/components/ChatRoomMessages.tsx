/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";

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
  ButtonLink,
  Center,
  Column,
  IconButton,
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

const ActionButtons = ({ onEditMessage, onDeleteMessage }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);

  function onMouseEnter() {
    setIsShowMenu(true);
  }

  function onMouseLeave() {
    setIsShowMenu(false);
  }

  return (
    <div
      css={styles.menuContainer}
      onMouseOver={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <IconButton>
        <IoMdMore
          size={theme.fonts.iconSizeBase}
          color={theme.colors.primary}
        />
      </IconButton>
      {isShowMenu && (
        <Column align="center" justify="flex-start" css={styles.dropdown}>
          <ButtonLink onClick={onEditMessage}>Edit</ButtonLink>
          <ButtonLink onClick={onDeleteMessage}>Delete</ButtonLink>
        </Column>
      )}
    </div>
  );
};

const Message = ({
  message: { id, content, author, authorId, status },
  subscribeToMore,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState();
  const { userId } = useStore();
  const [mutate] = useUpdateMessageMutation();
  const contentRef = useRef(null);

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
            {status === MessageStatus.deleted ? (
              <Text light italic>
                Deleted
              </Text>
            ) : (
              <Text light>{content}</Text>
            )}
          </MessageContent>
        </Row>
      </MessageItem>
    );
  }

  return (
    <MessageItem
      align="flex-end"
      key={id}
      onDoubleClick={() => onStartEditMessage(id)}
    >
      <Text paddingVertical="1rem" paddingHorizontal="2.8rem">
        {author.username}
      </Text>

      <Row css={styles.row}>
        <MessageContent backgroundColor="white">
          {isEditMode && selectedMessageId === id ? (
            <UpdateMessage
              message={{ id, content }}
              onClose={() => onFinishEditMessage()}
              height={contentRef.current && contentRef.current.offsetHeight}
            />
          ) : (
            <>
              {status === MessageStatus.deleted ? (
                <Text italic color={theme.colors.shadow}>
                  Deleted
                </Text>
              ) : (
                <Text ref={contentRef}>{content}</Text>
              )}
              {status !== MessageStatus.deleted && (
                <ActionButtons
                  onEditMessage={() => onStartEditMessage(id)}
                  onDeleteMessage={() =>
                    mutate({ id, status: MessageStatus.deleted })
                  }
                />
              )}
            </>
          )}
        </MessageContent>
        <UserAvatar username={author.username} />
      </Row>
    </MessageItem>
  );
};

const Messages = ({ roomId }) => {
  useCreateMessageSubscription();
  useUpdateMessageSubscription();
  const { loading, data, subscribeToMore, fetchMore } = useGetMessagesQuery(
    roomId,
  );
  const { setIsFetching, handleScroll } = useInfiniteScroll(onLoadMore);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current && scrollToBottom();

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
  }, [scrollToBottom, subscribeToMore, roomId]);

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

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView();
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
      <div css={styles.messagesContainerReverse}>
        <div ref={messagesEndRef} />
        {messages.map((message) => (
          <div key={message.id} css={styles.messageContent}>
            <Message message={message} subscribeToMore={subscribeToMore} />
          </div>
        ))}
      </div>
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
      <Column css={styles.headerContainer}>
        <Text>Chat: {currentChatId}</Text>
      </Column>
      <div css={styles.container}>
        <Messages roomId={currentChatId} />
      </div>
      <CreateMessage roomId={currentChatId} />
    </Center>
  );
});

const styles = {
  headerContainer: css`
    width: 100%;
    padding-bottom: 0.8rem;
    margin-bottom: 0.4rem;
    border-bottom: 1px solid ${theme.colors.primary};
  `,
  container: css`
    height: calc(100vh - 180px);
    width: 100%;
  `,
  row: css`
    justify-content: flex-end;
  `,
  emptyContainer: css`
    height: 100%;
  `,
  messagesContainer: css`
    height: 100%;
  `,
  messagesContainerReverse: css`
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
  menuContainer: css`
    position: relative;
    align-self: flex-start;
  `,
  dropdown: css`
    position: absolute;
    right: 0;
    top: 50;
    overflow: hidden;
    border-radius: 0.5rem;
    background-color: white;
    transition: background 250ms ease-in-out, transform 150ms ease;
    box-shadow: 0px 0px 10px ${theme.colors.shadow};
  `,
};

export default ChatRoomMessages;
