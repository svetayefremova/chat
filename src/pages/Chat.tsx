import React from "react";

import ChatRoomMessages from "../components/ChatRoomMessages";
import ChatRooms from "../components/ChatRooms";
import Layout from "../components/Layout";
import Notification from "../components/Notification";

const styles: any = {
  chat: {
    border: "1px solid #DDD",
    display: "flex",
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffeeff",
  },
  rightContainer: {
    padding: 16,
    flex: 4,
  },
};

const Chat = () => {
  return (
    <Layout>
      <div style={styles.chat}>
        <div style={styles.leftContainer}>
          <ChatRooms />
        </div>
        <div style={styles.rightContainer}>
          <ChatRoomMessages />
        </div>
      </div>
      <Notification />
    </Layout>
  );
};

export default Chat;
