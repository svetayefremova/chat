/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEffect, useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";

import { ON_UPDATE_MESSAGE } from "../graphql/subscriptions";
import { useUpdateMessageMutation } from "../hooks/hooks";
import { useStore } from "../stores/store";
import {
  ButtonLink,
  Column,
  IconButton,
  MessageContent,
  MessageItem,
  Row,
  Text,
  theme,
} from "../theme";
import { Animation } from "../theme/types.d";
import UpdateMessage from "./UpdateMessage";
import UserAvatar from "./UserAvatar";

// TODO split code into components
enum MessageStatus {
  sent = "sent",
  updated = "updated",
  deleted = "deleted",
}

const ActionButtons = ({ onEditMessage, onDeleteMessage }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);

  function onMouseEnter() {
    setIsShowMenu(true);
  }

  function onMouseLeave() {
    setIsShowMenu(false);
  }

  return (
    <div
      css={styles.menuContainer}
      onMouseOver={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <IconButton>
        <IoMdMore
          size={theme.fonts.iconSizeBase}
          color={theme.colors.primary}
        />
      </IconButton>
      {isShowMenu && (
        <Column align="center" justify="flex-start" css={styles.dropdown}>
          <ButtonLink onClick={onEditMessage}>Edit</ButtonLink>
          <ButtonLink onClick={onDeleteMessage}>Delete</ButtonLink>
        </Column>
      )}
    </div>
  );
};

const Message = ({
  message: { id, content, author, authorId, status },
  subscribeToMore,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState();
  const { userId } = useStore();
  const [mutate] = useUpdateMessageMutation();
  const contentRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: ON_UPDATE_MESSAGE,
      variables: { id },
      updateQuery: (prev) => prev,
    });

    return () => unsubscribe();
  }, [subscribeToMore, id]);

  function onStartEditMessage(id: string) {
    setIsEditMode(!isEditMode);
    setSelectedMessageId(id);
  }

  function onFinishEditMessage() {
    setIsEditMode(!isEditMode);
    setSelectedMessageId(null);
  }

  if (authorId !== userId) {
    return (
      <MessageItem align="flex-start">
        <Text paddingVertical="1rem" paddingHorizontal="2.8rem">
          {author.username}
        </Text>
        <Row>
          <UserAvatar username={author.username} />
          <MessageContent
            backgroundColor={theme.colors.primary}
            animation={Animation.floatRight}
          >
            {status === MessageStatus.deleted ? (
              <Text light italic>
                Deleted
              </Text>
            ) : (
              <Text light>{content}</Text>
            )}
          </MessageContent>
        </Row>
      </MessageItem>
    );
  }

  return (
    <MessageItem
      align="flex-end"
      key={id}
      onDoubleClick={() => onStartEditMessage(id)}
    >
      <Text paddingVertical="1rem" paddingHorizontal="2.8rem">
        {author.username}
      </Text>

      <Row css={styles.row}>
        <MessageContent
          backgroundColor={theme.colors.white}
          animation={Animation.floatLeft}
        >
          {isEditMode && selectedMessageId === id ? (
            <UpdateMessage
              message={{ id, content }}
              onClose={() => onFinishEditMessage()}
              height={contentRef.current && contentRef.current.offsetHeight}
            />
          ) : (
            <>
              {status === MessageStatus.deleted ? (
                <Text italic color={theme.colors.darkFontColor}>
                  Deleted
                </Text>
              ) : (
                <>
                  <Text ref={contentRef}>{content}</Text>
                  <ActionButtons
                    onEditMessage={() => onStartEditMessage(id)}
                    onDeleteMessage={() =>
                      mutate({ id, status: MessageStatus.deleted })
                    }
                  />
                </>
              )}
            </>
          )}
        </MessageContent>
        <UserAvatar username={author.username} />
      </Row>
    </MessageItem>
  );
};

const styles = {
  row: css`
    justify-content: flex-end;
  `,
  menuContainer: css`
    position: relative;
    align-self: flex-start;
  `,
  dropdown: css`
    position: absolute;
    right: 0;
    top: 50;
    overflow: hidden;
    border-radius: 0.5rem;
    background-color: white;
    transition: background 250ms ease-in-out;
    box-shadow: 0px 0px 10px ${theme.colors.shadow};
  `,
};

export default Message;
