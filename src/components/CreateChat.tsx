import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";

import { USER } from "../config";
import { CREATE_CHATROOM } from "../graphql/mutations";
import { GET_USER, LIST_USERS } from "../graphql/queries";
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

interface ICreateChatRoomInput {
  members: string[];
  name: string;
}

// TODO split code into components

const useListUsersQuery = () => useQuery(LIST_USERS);
const useCreateChatRoomMutation = () => {
  const [createChatRoom] = useMutation(CREATE_CHATROOM, {
    refetchQueries() {
      return [
        {
          query: GET_USER,
          variables: { id: USER.id },
        },
      ];
    },
  });

  return (id, username) => {
    return createChatRoom({
      variables: {
        input: {
          members: [username, USER.username],
          name: `Chat with ${username}`,
        },
      },
    });
  };
};

const ListUsers = ({ onCreateChatRoom }) => {
  const { data, loading } = useListUsersQuery();
  const mutate = useCreateChatRoomMutation();

  async function create(id, username) {
    const {
      data: { createChatRoom },
    } = await mutate(id, username);

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

  return users
    .filter((user) => user.id !== USER.id)
    .map(({ username, id }) => (
      <div key={id}>
        <button onClick={() => create(id, username)}>
          <p>{username}</p>
        </button>
      </div>
    ));
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
