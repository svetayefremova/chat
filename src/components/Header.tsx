/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { GiChameleonGlyph } from "react-icons/gi";
import { MdExitToApp } from "react-icons/md";

import { useLogoutMutation } from "../hooks/hooks";
import { useStore } from "../stores/store";
import { Button, Column, Link, LogoTitle, theme } from "../theme";

const Header = () => {
  const mutate = useLogoutMutation();
  const { userId } = useStore();
  return (
    <Column justify="space-between" css={styles.header}>
      <Link to="/" css={styles.linkContainer}>
        <Column align="center" justify="center" css={styles.logoContainer}>
          <GiChameleonGlyph
            color={theme.colors.iconLight}
            size={theme.fonts.iconSizeBase}
          />
          {/* <img
            src={require("../assets/images/logo.png")}
            alt="chat-logo"
            css={styles.logo}
          /> */}
          <LogoTitle>Chattic</LogoTitle>
        </Column>
      </Link>
      {userId && (
        <Button onClick={mutate} height="4rem" primary>
          <MdExitToApp
            color={theme.colors.iconLight}
            size={theme.fonts.iconSizeBase}
          />
        </Button>
      )}
    </Column>
  );
};

const styles = {
  logoContainer: css`
    padding: 0.6rem 0;
  `,
  linkContainer: css`
    background-color: ${theme.colors.primaryShade3};
    padding: 0.6rem 0;
  `,
  header: css`
    flex: 1;
    background-color: ${theme.colors.primaryShade1};
  `,
};

export default Header;
