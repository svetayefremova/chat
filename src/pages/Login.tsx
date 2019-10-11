import React from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

const styles: any = {
  main: {
    display: "flex",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
  },
};

const Login = () => {
  return (
    <Layout>
      <div style={styles.main}>
        <p>Login form here</p>
        <Link to={"/register"}>
          <p>Sign in</p>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
