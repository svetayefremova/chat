import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect } from "react";

import { NEW_NOTIFICATION } from "../graphql/subscriptions";
import { useCurrentUserQuery, useGetUserQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateChat from "./CreateChat";

const linkStyle = {
  marginRight: 15,
};

const style: any = {
  item: {
    borderBottom: "1px solid red",
  },
  selected: {
    borderBottom: "1px solid black",
  },
  newMessage: {
    backgroundColor: "#FFE4E1",
  },
};

const ChatRoomItem = observer(({ room, onSelectChatRoom }) => {
  const { userId, currentChatId, chatsWithNotifications } = useStore();
  const otherUserId = room.members.find((memberId) => memberId !== userId);
  const { data, loading } = useGetUserQuery(otherUserId);

  const isNewMessage = chatsWithNotifications.has(room.id);

  if (loading) {
    return <p>...</p>;
  }

  const chatUser = data && data.getUser;
  const lastMessage = room.messages.length
    ? room.messages[room.messages.length - 1]
    : null;

  if (!chatUser) {
    return <p>Undefined user</p>;
  }

  return (
    <li
      key={room.id}
      onClick={onSelectChatRoom}
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
      {isNewMessage && (
        <p>{chatsWithNotifications.get(room.id)} new messages</p>
      )}
    </li>
  );
});

const ChatRooms = () => {
  const { loading, data, refetch, subscribeToMore } = useCurrentUserQuery();
  const { setCurrentChatId, userId, clearChatNotifications } = useStore();

  useEffect(() => {
    subscribeToMore({
      document: NEW_NOTIFICATION,
      variables: { userId },
      updateQuery: (prev) => {
        refetch();
        return prev;
      },
    });
  }, [subscribeToMore, refetch, userId]);

  function onSelectChatRoom(roomId) {
    clearChatNotifications(roomId);
    setCurrentChatId(roomId);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRooms = data && data.currentUser && data.currentUser.chatRooms;

  if (!chatRooms || !chatRooms.length) {
    return (
      <div>
        <p>No chat rooms</p>
        <CreateChat />
      </div>
    );
  }

  return (
    <div>
      <ul>
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
      <CreateChat />
    </div>
  );
};

export default ChatRooms;
