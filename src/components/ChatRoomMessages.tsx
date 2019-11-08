/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { observer } from "mobx-react";

import { useGetChatRoomQuery, useGetUserQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import { Center, Column, Text, theme } from "../theme";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

const ChatRoomTitle = ({ chatWith }) => {
  const { data } = useGetUserQuery(chatWith);

  const chatUser = data && data.getUser;

  return (
    <Text color={theme.colors.primary}>
      <strong>Chat with {chatUser && chatUser.username}</strong>
    </Text>
  );
};

const ChatRoomMessages = observer(() => {
  const { currentChatId, userId } = useStore();
  const { data } = useGetChatRoomQuery(currentChatId);

  if (!currentChatId) {
    return (
      <Center>
        <Text size="2rem" textAlign="center">
          Welcome to the Chattic!
        </Text>
        <Text paddingVertical="1rem" textAlign="center">
          Nice to see you here! Make your first steps and start chatting with
          visitors
        </Text>
      </Center>
    );
  }

  const chatRoom = data && data.getChatRoom;
  const chatWith =
    chatRoom && chatRoom.members.find((member) => member !== userId);

  return (
    <Center>
      <Column css={styles.headerContainer}>
        <ChatRoomTitle chatWith={chatWith} />
      </Column>
      <div css={styles.messagesContainer}>
        <Messages roomId={currentChatId} />
      </div>
      <CreateMessage roomId={currentChatId} />
    </Center>
  );
});

const styles = {
  headerContainer: css`
    width: 100%;
    padding-bottom: 0.8rem;
    margin-bottom: 0.4rem;
    border-bottom: 1px solid ${theme.colors.primary};
  `,
  messagesContainer: css`
    height: calc(100vh - 180px);
    width: 100%;
  `,
};

export default ChatRoomMessages;
