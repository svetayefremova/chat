import React, { useEffect, useState } from "react";

import {
  ICreateMessageInput,
  useCreateChatRoomMutation,
  useCreateMessageMutation,
  useListUsersQuery,
} from "../hooks/hooks";
import { useStore } from "../stores/store";

const styles: any = {
  modal: {
    position: "absolute",
    zIndex: 1,
    left: 100,
    bottom: 100,
    top: 100,
    right: 100,
    backgroundColor: "white",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .2)",
    padding: 20,
  },
};

// TODO split code into components

const ListUsers = ({ onCreateChat }) => {
  const { data, loading } = useListUsersQuery();
  const { userId } = useStore();

  if (loading) {
    return <p>Loading...</p>;
  }

  const users = data && data.listUsers;
  if (!users) {
    return <p>No users</p>;
  }

  return users.map(({ username, id }) => {
    if (id === userId) {
      return null;
    }

    return (
      <div key={id}>
        <button onClick={() => onCreateChat(id)}>
          <p>{username}</p>
        </button>
      </div>
    );
  });
};

const Modal = ({ onClose, ...props }) => {
  return (
    <div style={styles.modal}>
      <button onClick={onClose}>Close</button>
      {props.children}
    </div>
  );
};

const CreateChat = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { userId, setCurrentChatId, currentChatId } = useStore();
  const mutate = useCreateChatRoomMutation(userId);
  const [createFirstMessage] = useCreateMessageMutation(currentChatId);

  useEffect(() => {
    const createMessageInput: ICreateMessageInput = {
      content: "😀",
      authorId: userId,
      chatRoomId: currentChatId,
    };
    createFirstMessage(createMessageInput);
  }, [currentChatId]);

  async function onCreateChat(id) {
    const {
      data: { createChatRoom },
    } = await mutate(userId, id);
    setCurrentChatId(createChatRoom.id);
    setIsShowModal(false);
  }

  return (
    <div>
      <button onClick={() => setIsShowModal(true)}>Create chat</button>
      {isShowModal ? (
        <Modal onClose={() => setIsShowModal(false)}>
          <ListUsers onCreateChat={onCreateChat} />
        </Modal>
      ) : null}
    </div>
  );
};

export default CreateChat;
