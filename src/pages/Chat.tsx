/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import ChatRoomMessages from "../components/ChatRoomMessages";
import ChatRooms from "../components/ChatRooms";
import Layout from "../components/Layout";
import Notification from "../components/Notification";
import { Row, theme } from "../theme";

const Chat = () => {
  return (
    <Layout>
      <Row css={styles.row}>
        <div css={styles.leftContainer}>
          <ChatRooms />
        </div>
        <div css={styles.rightContainer}>
          <ChatRoomMessages />
        </div>
      </Row>
      <Notification />
    </Layout>
  );
};

const styles = {
  row: css`
    width: 100%;
  `,
  leftContainer: css`
    flex: 1;
    background-color: ${theme.colors.primary};
    box-shadow: 10px 0 5px -2px ${theme.colors.shadow};
  `,
  rightContainer: css`
    flex: 4;
    padding: 1rem;
  `,
};

export default Chat;
