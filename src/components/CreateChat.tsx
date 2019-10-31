import React, { useEffect, useState } from "react";

import { useCreateChatRoomMutation, useListUsersQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";

const styles: any = {
  modal: {
    position: "absolute",
    zIndex: 1,
    left: "20%",
    bottom: "20%",
    top: "20%",
    right: "20%",
    backgroundColor: "white",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .2)",
    padding: 20,
    overflowY: "auto",
  },
};

// TODO split code into components
const ListUsers = ({ onCreateChat, isFetching, stopFetching }) => {
  const { data, loading, fetchMore } = useListUsersQuery();
  const { userId } = useStore();

  useEffect(() => {
    if (!isFetching) {
      return;
    }
    loadMoreItems();
  }, [isFetching, loadMoreItems]);

  function loadMoreItems() {
    fetchMore({
      variables: {
        skip: data.listUsers.length,
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        stopFetching();
        return Object.assign({}, prev, {
          listUsers: [...prev.listUsers, ...fetchMoreResult.listUsers],
        });
      },
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const users = data && data.listUsers;
  if (!users) {
    return <p>No users</p>;
  }

  return (
    <ul>
      {users.map(({ username, id }) => {
        if (id === userId) {
          return null;
        }

        return (
          <li key={id}>
            <button onClick={() => onCreateChat(id)}>
              <p>{username}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const Modal = ({ onClose, onScroll, ...props }) => {
  return (
    <div style={styles.modal} onScroll={onScroll}>
      <button onClick={onClose}>Close</button>
      {props.children}
    </div>
  );
};

// TODO refactor
const ListUsersModal = ({ onClose, onCreateChat }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = ({ currentTarget }) => {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      setIsFetching(true);
    }
  };

  return (
    <Modal onClose={onClose} onScroll={(e) => handleScroll(e)}>
      <ListUsers
        onCreateChat={onCreateChat}
        isFetching={isFetching}
        stopFetching={() => setIsFetching(false)}
      />
    </Modal>
  );
};

const CreateChat = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { userId, setCurrentChatId } = useStore();
  const mutate = useCreateChatRoomMutation();

  async function onCreateChat(id) {
    const {
      data: { createChatRoom },
    } = await mutate([userId, id]);
    setCurrentChatId(createChatRoom.id);
    setIsShowModal(false);
  }

  return (
    <div>
      <button onClick={() => setIsShowModal(true)}>Create chat</button>
      {isShowModal ? (
        <ListUsersModal
          onClose={() => setIsShowModal(false)}
          onCreateChat={onCreateChat}
        />
      ) : null}
    </div>
  );
};

export default CreateChat;
