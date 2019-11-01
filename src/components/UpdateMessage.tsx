/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

import { IUpdateMessageInput, useUpdateMessageMutation } from "../hooks/hooks";
import { Column, IconButton, Text, Textarea, theme } from "../theme";

const UpdateMessage = ({ message, onClose, height }) => {
  const [content, setContent] = useState(message.content);
  const [mutate, loading, error] = useUpdateMessageMutation();

  async function update(e: React.KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (content === "") {
      onClose();
      return;
    }

    const updateMessageInput: IUpdateMessageInput = {
      content,
      id: message.id,
    };

    await mutate(updateMessageInput);
    onClose();
  }

  return (
    <Column
      align="flex-start"
      justify="flex-end"
      css={css`
        flex: 1;
      `}
    >
      <IconButton onClick={onClose}>
        <IoMdClose size={theme.fonts.iconSizeSmall} />
      </IconButton>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error :( Please try again</Text>}
      <Textarea
        name="message"
        placeholder="Type your message"
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => update(e)}
        value={content}
        rows={height / 16 || 4}
      />
    </Column>
  );
};

export default UpdateMessage;
