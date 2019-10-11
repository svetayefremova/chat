import { useMutation } from "@apollo/react-hooks";
import useForm from "rc-form-hooks";
import React, { useState } from "react";

import { CREATE_USER } from "../graphql/mutations";

const style: any = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const useCreateUserMutation = () => {
  const [createUser] = useMutation(CREATE_USER);

  return (username: string) =>
    createUser({
      variables: { input: { username } },
    });
};

const AuthForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const { getFieldDecorator, validateFields } = useForm<{ username: string }>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await validateFields();
    setUsername("");
    onSubmit(username);
  }

  return (
    <form onSubmit={handleSubmit} style={style.form}>
      <label>
        Username
        {getFieldDecorator("username")(
          <input type="text" onChange={(e) => setUsername(e.target.value)} />,
        )}
      </label>
      <button type={"submit"}>Create</button>
    </form>
  );
};

const CreateUser = ({ onLogin }) => {
  const mutate = useCreateUserMutation();

  async function onRegister(username: string) {
    const {
      data: { createUser },
    } = await mutate(username);
    if (createUser) {
      onLogin(createUser.id);
    } else {
      // TODO add error handling in store and error component
      alert("Ooops... something went wrong...");
    }
  }

  return <AuthForm onSubmit={onRegister} />;
};

export default CreateUser;
