/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { IoMdClose } from "react-icons/io";

import { IconButton, theme } from "../theme";

const Modal = ({ onClose, onScroll, ...props }) => {
  return (
    <div css={styles.modalBackground}>
      <div css={styles.modal} onScroll={onScroll}>
        <div css={styles.closeButton}>
          <IconButton onClick={onClose}>
            <IoMdClose size={theme.fonts.iconSizeSmall} />
          </IconButton>
        </div>
        <div css={styles.modalBody}>{props.children}</div>
      </div>
    </div>
  );
};

const styles = {
  modalBackground: css`
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `,
  modal: css`
    width: 24rem;
    height: 80vh;
    background-color: ${theme.colors.white};
    box-shadow: 0px 0px 10px ${theme.colors.shadow};
    overflow-y: auto;
  `,
  modalBody: css`
    padding: 1.2rem;
  `,
  closeButton: css`
    position: absolute;
    width: 24rem;
    background-color: ${theme.colors.white};
  `,
};

export default Modal;
