/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect } from "react";

import { NEW_NOTIFICATION } from "../graphql/subscriptions";
import {
  useCurrentUserQuery,
  useGetMessagesQuery,
  useGetUserQuery,
  useMarkAsReadMutation,
} from "../hooks/hooks";
import { useStore } from "../stores/store";
import { Row, ScrollContainer, Text, theme } from "../theme";
import CreateChat from "./CreateChat";
import UserAvatar from "./UserAvatar";

const ChatRoomItem = observer(({ room, onSelectChatRoom }) => {
  const { userId, currentChatId } = useStore();
  const otherUserId = room.members.find((memberId) => memberId !== userId);
  const { data, loading } = useGetUserQuery(otherUserId);
  const filter = { isRead: { _EQ: false }, authorId: { _NE: userId } };
  const {
    data: messagesData,
    loading: messagesLoading,
    subscribeToMore,
    refetch,
  } = useGetMessagesQuery(room.id, filter);
  const [markAsRead] = useMarkAsReadMutation(room.id, filter);

  useEffect(() => {
    subscribeToMore({
      document: NEW_NOTIFICATION,
      variables: { userId },
      updateQuery: (prev) => {
        // refetch to get unread messages
        refetch();
        return prev;
      },
    });
  }, [subscribeToMore, refetch, userId]);

  function onSelect() {
    markAsRead({ chatRoomId: room.id, userId });
    onSelectChatRoom();
  }

  if (loading || messagesLoading) {
    return;
  }

  const chatUser = data && data.getUser;

  // find if there are any unread message
  const messages = messagesData && messagesData.getMessages;
  const isNewMessage = messages.length;

  // show the last message in the chat room
  const lastMessage = room.messages.length
    ? room.messages[room.messages.length - 1]
    : null;

  if (!chatUser) {
    return <Text light>Undefined user</Text>;
  }

  return (
    <div
      key={room.id}
      onClick={() => onSelect()}
      css={[
        styles.item,
        currentChatId === room.id && styles.selected,
        isNewMessage && styles.newMessage,
      ]}
    >
      <Row align="flex-start">
        <UserAvatar username={chatUser.username} margin="0.5rem 0" />
        <div css={styles.itemContent}>
          <Text light size="1.1rem" paddingVertical="0.4rem">
            <strong>{chatUser.username}</strong>
          </Text>
          {lastMessage && (
            <>
              <Text light opacity={0.9} css={styles.textTruncated}>
                {lastMessage.content}
              </Text>
              <Text light opacity={0.8} size="0.7rem" paddingVertical="0.3rem">
                {moment.unix(lastMessage.updatedAt).format("DD MMM h:mm:ss")}
              </Text>
            </>
          )}
        </div>
      </Row>
    </div>
  );
});

const ChatRooms = () => {
  const { loading, data, refetch, subscribeToMore } = useCurrentUserQuery();
  const { setCurrentChatId, userId } = useStore();

  useEffect(() => {
    subscribeToMore({
      document: NEW_NOTIFICATION,
      variables: { userId },
      updateQuery: (prev) => {
        // refetch if we get new messages from old or there are messages from new created chats
        refetch();
        return prev;
      },
    });
  }, [subscribeToMore, refetch, userId]);

  function onSelectChatRoom(roomId) {
    setCurrentChatId(roomId);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRooms = data && data.currentUser && data.currentUser.chatRooms;

  if (!chatRooms || !chatRooms.length) {
    return (
      <div>
        <CreateChat />
      </div>
    );
  }

  return (
    <>
      <CreateChat />
      <ScrollContainer width="15rem">
        {chatRooms.map((room) => (
          <ChatRoomItem
            key={room.id}
            room={room}
            onSelectChatRoom={() => onSelectChatRoom(room.id)}
          />
        ))}
      </ScrollContainer>
    </>
  );
};

const styles = {
  link: css`
    margin-right: 1rem;
  `,
  item: css`
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 0.5rem;
    flex-direction: column;
    -webkit-appearance: none;
    -moz-appearance: none;
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
      transition: background 250ms ease-in-out, transform 150ms ease;
    }
  `,
  itemContent: css`
    width: 10rem;
    padding: 0 0.5rem;
  `,
  selected: css`
    border-left: 4px solid rgba(255, 255, 255, 1);
  `,
  newMessage: css`
    background-color: rgba(255, 255, 255, 0.24);
  `,
  textTruncated: css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
};

export default ChatRooms;
