/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { MainContainer } from "../theme";
import Header from "./Header";

const Layout = (props) => (
  <MainContainer>
    <div css={styles.leftContainer}>
      <Header />
    </div>
    <div css={styles.rightContainer}>{props.children}</div>
  </MainContainer>
);

const styles = {
  leftContainer: css`
    flex: 1;
    max-width: 4rem;
    display: flex;
  `,
  rightContainer: css`
    flex: 5;
    display: flex;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.24);
  `,
};
export default Layout;
