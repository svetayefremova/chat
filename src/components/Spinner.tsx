/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { theme } from "../theme";

const Spinner = () => (
  <div css={styles.ellipsis}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

const styles = {
  ellipsis: css`
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;

    div {
      position: absolute;
      top: 27px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${theme.colors.baseColorOpacity};
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    div:nth-of-type(1) {
      left: 6px;
      animation: lds-ellipsis1 0.6s infinite;
    }

    div:nth-of-type(2) {
      left: 6px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    div:nth-of-type(3) {
      left: 26px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    div:nth-of-type(4) {
      left: 45px;
      animation: lds-ellipsis3 0.6s infinite;
    }

    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(19px, 0);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
  `,
};
export default Spinner;
