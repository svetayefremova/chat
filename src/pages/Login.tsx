import React from "react";
import { Link } from "react-router-dom";

import AuthForm from "../components/AuthFrom";
import Layout from "../components/Layout";
import { useLoginMutation } from "../hooks/hooks";

const styles: any = {
  main: {
    display: "flex",
    flexDirection: "column",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
  },
};

const Login = () => {
  const mutate = useLoginMutation();

  async function onLogin(username: string, password: string) {
    const {
      data: { login },
    } = await mutate(username, password);
    if (!login) {
      // TODO add error handling in store and error component
      alert("Ooops... something went wrong...");
    }
  }

  return (
    <Layout>
      <div style={styles.main}>
        <AuthForm onSubmit={onLogin} buttonText="Login" />
        <Link to={"/register"}>
          <p>Sign in</p>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
