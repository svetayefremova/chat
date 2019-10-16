import React, { useState } from "react";

import { IUpdateMessageInput, useUpdateMessageMutation } from "../hooks/hooks";

const styles: any = {
  updateInput: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  input: {
    height: 20,
    padding: 12,
    width: "100%",
  },
};

const UpdateMessage = ({ message, onClose }) => {
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
    <div style={styles.updateInput}>
      <input
        name="message"
        placeholder="Type your message"
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => update(e)}
        value={content}
        style={styles.input}
      />
      <button onClick={onClose}>X</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </div>
  );
};

export default UpdateMessage;
