import React from "react";

import ChatRoomMessages from "../components/ChatRoomMessages";
import ChatRooms from "../components/ChatRooms";
import Layout from "../components/Layout";

const styles: any = {
  chat: {
    border: "1px solid #DDD",
    display: "flex",
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff999",
  },
  rightContainer: {
    padding: 16,
    flex: 4,
  },
};

const Chat = (props) => {
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
    </Layout>
  );
};

export default Chat;
