import React from "react";

import { useGetUserQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateChat from "./CreateChat";

const linkStyle = {
  marginRight: 15,
};

const ChatRooms = () => {
  const { userId, setCurrentChatId } = useStore();
  const { loading, data } = useGetUserQuery(userId);

  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRooms = data && data.getUser && data.getUser.chatRooms;

  console.log("user", data.getUser);

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
        {chatRooms.map((room) => (
          <li key={room.id} onClick={() => setCurrentChatId(room.id)}>
            <p style={linkStyle}>{room.name}</p>
          </li>
        ))}
      </ul>
      <CreateChat />
    </div>
  );
};

export default ChatRooms;
