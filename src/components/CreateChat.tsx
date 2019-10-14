import React, { useState } from "react";

import { useCreateChatRoomMutation, useListUsersQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import CreateMessage from "./CreateMessage";

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

const ListUsers = ({ onCreateChatRoom }) => {
  const { data, loading } = useListUsersQuery();
  const { userId } = useStore();
  const mutate = useCreateChatRoomMutation(userId);

  async function create(id, username) {
    const {
      data: { createChatRoom },
    } = await mutate(id, username, userId);

    if (createChatRoom) {
      onCreateChatRoom(createChatRoom.id);
    }
  }

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
        <button onClick={() => create(id, username)}>
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
  const { setCurrentChatId } = useStore();

  const onCreateChatRoom = (id) => {
    console.log("onCreateChatRoom", id);
    setIsShowModal(false);
    setCurrentChatId(id);
  };

  return (
    <div>
      <button onClick={() => setIsShowModal(true)}>Create chat</button>
      {isShowModal ? (
        <Modal onClose={() => setIsShowModal(false)}>
          <ListUsers onCreateChatRoom={onCreateChatRoom} />
        </Modal>
      ) : null}
    </div>
  );
};

export default CreateChat;
