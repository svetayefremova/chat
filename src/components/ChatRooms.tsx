import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { observer } from 'mobx-react';

import { GET_USER } from "../graphql/queries";
import CreateChat from "./CreateChat";
import { useStore } from '../stores/store';

const linkStyle = {
  marginRight: 15,
};

const useGetUserQuery = (id) => useQuery(GET_USER, { variables: { id } });

const ChatRooms = observer(() => {
  const { userId, setCurrentChatId } = useStore();
  const { loading, data } = useGetUserQuery(userId);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  const chatRooms = data && data.getUser && data.getUser.chatRooms;

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
            <p style={linkStyle} >{room.name}</p>
          </li>
        ))}
      </ul>
      <CreateChat />
    </div>
  );
});

export default ChatRooms;
