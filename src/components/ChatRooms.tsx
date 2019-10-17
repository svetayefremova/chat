import React, { useEffect } from "react";

import { NEW_NOTIFICATION } from "../graphql/subscriptions";
import { useCurrentUserQuery, useGetUserQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateChat from "./CreateChat";

const linkStyle = {
  marginRight: 15,
};

const ChatRoomItem = ({ room, onSelectChatRoom }) => {
  const { userId } = useStore();
  const otherUserId = room.members.find((member) => member !== userId);

  const { data, loading } = useGetUserQuery(otherUserId);

  if (loading) {
    return <p>...</p>;
  }

  const chatUser = data && data.getUser;
  const lastMessage = room.messages.length
    ? room.messages[room.messages.length - 1].content
    : "";

  if (!chatUser) {
    return <p>Undefined user</p>;
  }

  return (
    <li key={room.id} onClick={onSelectChatRoom}>
      <p style={linkStyle}>{chatUser.username}</p>
      <p>{lastMessage}</p>
    </li>
  );
};

const ChatRooms = () => {
  const { loading, data, refetch, subscribeToMore } = useCurrentUserQuery();
  const { setCurrentChatId, userId } = useStore();

  useEffect(() => {
    subscribeToMore({
      document: NEW_NOTIFICATION,
      variables: { userId },
      updateQuery: (prev, { subscriptionData: { data } }) => {
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
