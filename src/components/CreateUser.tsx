import useForm from "rc-form-hooks";
import React, { useState } from "react";

import { useCreateUserMutation } from "../hooks/hooks";

const style: any = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
