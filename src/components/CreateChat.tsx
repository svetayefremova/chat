/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";

import { useCreateChatRoomMutation, useListUsersQuery } from "../hooks/hooks";
import { useStore } from "../stores/store";
import { Button, Center, ListItem, Row, Text, theme } from "../theme";
import Modal from "./Modal";
import Spinner from "./Spinner";
import UserAvatar from "./UserAvatar";

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
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const users = data && data.listUsers;
  if (!users) {
    return (
      <Center>
        <Text>No Users</Text>
      </Center>
    );
  }

  return (
    <ul>
      {users.map(({ username, id }) => {
        if (id === userId) {
          return null;
        }

        return (
          <ListItem key={id} onClick={() => onCreateChat(id)}>
            <Row align="center">
              <UserAvatar username={username} margin="0 0.5rem 0 0" />
              <Text>{username}</Text>
            </Row>
            <IoIosAdd
              color={theme.colors.primary}
              size={theme.fonts.iconSizeBase}
            />
          </ListItem>
        );
      })}
    </ul>
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
    <>
      <Button onClick={() => setIsShowModal(true)} transparent>
        Create new chat
      </Button>
      {isShowModal ? (
        <ListUsersModal
          onClose={() => setIsShowModal(false)}
          onCreateChat={onCreateChat}
        />
      ) : null}
    </>
  );
};

export default CreateChat;
