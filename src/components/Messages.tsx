/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEffect, useRef } from "react";

import { ON_CREATE_MESSAGE } from "../graphql/subscriptions";
import {
  useCreateMessageSubscription,
  useGetMessagesQuery,
  useUpdateMessageSubscription,
} from "../hooks/hooks";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { Center, ScrollContainer, Text } from "../theme";
import Message from "./Message";
import Spinner from "./Spinner";

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
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const messages = data && data.getMessages;

  if (!messages || !messages.length) {
    return (
      <Center>
        <Text>No Messages</Text>
        <Text size="0.8rem" paddingVertical="1rem">
          When you have messages, you will see them here
        </Text>
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

const styles = {
  messagesContainer: css`
    height: 100%;
  `,
  messagesContainerReverse: css`
    display: flex;
    flex-direction: column-reverse;
  `,
  messageContent: css`
    display: flex;
    align-self: stretch;
  `,
};

export default Messages;
