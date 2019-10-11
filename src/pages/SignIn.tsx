import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { observer } from 'mobx-react';

import CreateUser from "../components/CreateUser";
import Layout from "../components/Layout";
import { useStore } from '../stores/store';

const styles: any = {
  main: {
    display: "flex",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
  },
};

const SignIn = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const {  setUserId } = useStore();

  const { from } = location.state || { from: { pathname: "/" } };

  function login(userId) {
    console.log('login', userId);
    setUserId(userId);
    history.replace(from);
  }

  return (
    <Layout>
      <div style={styles.main}>
        <CreateUser onLogin={(userId) => login(userId)} />
      </div>
    </Layout>
  );
});

export default SignIn;
