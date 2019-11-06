import React from "react";
import { Link } from "react-router-dom";

import AuthForm from "../components/AuthFrom";
import Layout from "../components/Layout";
import { useLoginMutation } from "../hooks/hooks";
import { ButtonLink, Column, Text, theme } from "../theme";

const Login = () => {
  const [mutate, loading, error] = useLoginMutation();

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
      <Column justify="center" align="flex-end">
        <AuthForm
          onSubmit={onLogin}
          buttonText="Login"
          error={error}
          loading={loading}
        />
        <Link to={"/register"}>
          <ButtonLink>
            <Text size="1rem" color={theme.colors.primary}>
              Sign in
            </Text>
          </ButtonLink>
        </Link>
      </Column>
    </Layout>
  );
};

export default Login;
