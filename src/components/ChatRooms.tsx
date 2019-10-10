import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { Link } from "react-router-dom";

import { USER } from "../config";
import { GET_USER } from "../graphql/queries";
import CreateChat from "./CreateChat";

const linkStyle = {
  marginRight: 15,
};

const useGetUserQuery = () =>
  useQuery(GET_USER, { variables: { id: USER.id } });

const ChatLink = (props) => (
  <li>
    <Link to={`/chat/${props.room.id}`}>
      <p style={linkStyle} >{props.room.name}</p>
    </Link>
  </li>
);

const ChatRooms = () => {
  const { loading, data } = useGetUserQuery();

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
          <ChatLink room={room} key={room.id} />
        ))}
      </ul>
      <CreateChat />
    </div>
  );
};

export default ChatRooms;
