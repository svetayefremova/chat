import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect } from "react";

import { NEW_NOTIFICATION } from "../graphql/subscriptions";
import {
  useCurrentUserQuery,
  useGetUserQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation
} from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateChat from "./CreateChat";

const linkStyle = {
  marginRight: 15,
};

const style: any = {
  container: {
    maxHeight: 400,
    overflow: "auto",
  },
  item: {
    borderBottom: "1px solid black",
  },
  selected: {
    border: "1px solid orange",
  },
  newMessage: {
    backgroundColor: "#FFE4E1",
  },
};

const ChatRoomItem = observer(({ room, onSelectChatRoom }) => {
  const { userId, currentChatId } = useStore();
  const otherUserId = room.members.find((memberId) => memberId !== userId);
  const { data, loading } = useGetUserQuery(otherUserId);
  const filter = { isRead: { _EQ: false }, authorId: { _NE: userId }};
  const {
    data: messagesData,
    loading: messagesLoading,
    subscribeToMore,
    refetch
  } = useGetMessagesQuery(room.id, filter);
  const [markAsRead] = useMarkAsReadMutation(room.id, filter)

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
    markAsRead({ chatRoomId: room.id, userId })
    onSelectChatRoom()
  }

  if (loading || messagesLoading) {
    return <p>...</p>;
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
    return <p>Undefined user</p>;
  }

  return (
    <li
      key={room.id}
      onClick={() => onSelect()}
      style={
        isNewMessage
          ? style.newMessage
          : currentChatId === room.id
          ? style.selected
          : style.item
      }
    >
      <p style={linkStyle}>{chatUser.username}</p>
      {lastMessage && (
        <>
          <p>{lastMessage.content}</p>
          <p>{moment.unix(lastMessage.updatedAt).format("DD MMM h:mm:ss")}</p>
        </>
      )}
    </li>
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
      <div style={style.container}>
        <p>No chat rooms</p>
        <CreateChat />
      </div>
    );
  }

  return (
    <div>
       <CreateChat />
      <ul style={style.container}>
        {chatRooms.map((room) => {
          return room.isGroupChat ? (
            <li key={room.id} onClick={() => onSelectChatRoom(room.id)}>
              <p style={linkStyle}>{room.name}</p>
            </li>
          ) : (
            <ChatRoomItem
              key={room.id}
              room={room}
              onSelectChatRoom={() => onSelectChatRoom(room.id)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ChatRooms;
