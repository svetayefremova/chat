import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import AuthForm from "../components/AuthFrom";
import Layout from "../components/Layout";
import { useSignUpMutation } from "../hooks/hooks";

const styles: any = {
  main: {
    display: "flex",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
  },
};

const Signup = () => {
  const mutate = useSignUpMutation();
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  async function onSignup(username: string, password: string) {
    const {
      data: { signup },
    } = await mutate(username, password);
    if (signup) {
      history.replace(from);
    } else {
      // TODO add error handling in store and error component
      alert("Ooops... something went wrong...");
    }
  }

  return (
    <Layout>
      <div style={styles.main}>
        <AuthForm onSubmit={onSignup} buttonText="Register" />
      </div>
    </Layout>
  );
};

export default Signup;
