/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useForm from "rc-form-hooks";
import { useState } from "react";

import { Button, Center, FormInput, Label, Text, theme } from "../theme";
import Spinner from "./Spinner";

const AuthForm = ({ onSubmit, buttonText, error, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { getFieldDecorator, validateFields } = useForm<{
    username: string;
    password: string;
  }>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await validateFields();
    await onSubmit(username, password);
    setUsername("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} css={styles.form}>
      <Label>
        Username
        {getFieldDecorator("username")(
          <FormInput
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />,
        )}
      </Label>
      <Label>
        Password
        {getFieldDecorator("password")(
          <FormInput
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />,
        )}
      </Label>
      {error && (
        <Text danger size="0.8rem">
          {error.message}
        </Text>
      )}
      {loading && (
        <Center height="auto">
          <Spinner />
        </Center>
      )}
      <Button type={"submit"} css={styles.submitButton} disabled={loading}>
        {buttonText}
      </Button>
    </form>
  );
};

const styles = {
  form: css`
    width: 20rem;
    background: ${theme.colors.white};
    padding: 2rem;
    margin-bottom: 0.8rem;
  `,
  submitButton: css`
    margin-top: 2rem;
    margin-bottom: 1rem;
  `,
};

export default AuthForm;
