import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import AuthForm from "../components/AuthFrom";
import Layout from "../components/Layout";
import { useSignUpMutation } from "../hooks/hooks";
import { ButtonLink, Column, Text, theme } from "../theme";

const Signup = () => {
  const [mutate, loading, error] = useSignUpMutation();
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
      <Column justify="center" align="flex-end">
        <AuthForm
          onSubmit={onSignup}
          buttonText="Register"
          loading={loading}
          error={error}
        />
        <Link to={"/"}>
          <ButtonLink>
            <Text size="1rem" color={theme.colors.primary}>
              Login
            </Text>
          </ButtonLink>
        </Link>
      </Column>
    </Layout>
  );
};

export default Signup;
