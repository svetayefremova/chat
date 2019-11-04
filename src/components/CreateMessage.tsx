/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import { IoMdPaperPlane } from "react-icons/io";

import { ICreateMessageInput, useCreateMessageMutation } from "../hooks/hooks";
import { useStore } from "../stores/store";
import {
  MessageInput,
  Text,
  theme,
} from "../theme";

const CreateMessage = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const { userId } = useStore();
  const [mutate, loading, error] = useCreateMessageMutation(roomId);

  async function create(e: React.KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (message === "") {
      return;
    }

    const createMessageInput: ICreateMessageInput = {
      content: message,
      authorId: userId,
      chatRoomId: roomId,
    };

    await mutate(createMessageInput);

    setMessage("");
  }

  return (
    <div css={styles.inputContainer}>
      <MessageInput
        name="message"
        placeholder="Type your message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => create(e)}
        value={message}
      />
      <IoMdPaperPlane
        color={theme.colors.primaryShade3}
        fontSize={theme.fonts.iconSizeBase}
        css={styles.icon}
      />        
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error :( Please try again</Text>}
    </div>
  );
};

const styles = {
  inputContainer: css`
    width: 100%;
    padding: 1rem;
    position: relative;
  `,
  icon: css`
    position: absolute;
    right: 1.6rem;
    top: 1.6rem
  `
}

export default CreateMessage;
