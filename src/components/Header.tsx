import React from "react";
import { Link } from "react-router-dom";

import { useLogoutMutation } from "../hooks/hooks";
import { useStore } from "../stores/store";

const styles: any = {
  header: {
    padding: 15,
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginRight: 10,
    width: 40,
    height: 40,
  },
};

const Header = () => {
  const mutate = useLogoutMutation();
  const { userId } = useStore();
  return (
    <div style={styles.header}>
      <Link to="/">
        <div style={styles.link}>
          <img
            src={require("../assets/images/logo.png")}
            alt="chat-logo"
            style={styles.logo}
          />
          <h1>CHAT</h1>
        </div>
      </Link>
      {userId && <button onClick={mutate}>Logout</button>}
    </div>
  );
};

export default Header;
