import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import CreateUser from "../components/CreateUser";
import Layout from "../components/Layout";
import { fakeAuth } from "../services/fakeAuth";

const styles: any = {
  main: {
    display: "flex",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
  },
};

const Register = () => {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const login = () => {
    fakeAuth.authenticate(() => {
      history.replace(from);
    });
  };

  return (
    <Layout>
      <div style={styles.main}>
        <CreateUser onLogin={login} />
      </div>
    </Layout>
  );
};

export default Register;
