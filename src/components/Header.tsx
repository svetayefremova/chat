import React from "react";
import { Link } from "react-router-dom";

const styles: any = {
  header: {
    padding: 15,
    backgroundColor: "#eee",
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

const Header = () => (
  <div style={styles.header}>
    <Link to="/">
      <div style={styles.link}>
        <img
          src="../assets/images/logo.png"
          alt="chat-logo"
          style={styles.logo}
        />
        <h1>CHAT</h1>
      </div>
    </Link>
  </div>
);

export default Header;
