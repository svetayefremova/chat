import React, { useState } from "react";

import { ICreateMessageInput, useCreateMessageMutation } from "../hooks/hooks";
import { useStore } from "../stores/store";

const styles: any = {
  typeInput: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffeeff",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 20,
    padding: 12,
    width: "100%",
  },
};

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
    <div style={styles.typeInput}>
      <input
        name="message"
        placeholder="Type your message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => create(e)}
        value={message}
        style={styles.input}
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </div>
  );
};

export default CreateMessage;
