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

const CreateUserForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const { getFieldDecorator, validateFields } = useForm<{ username: string }>();
  const mutate = useCreateUserMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await validateFields();
    await mutate(username);
    setUsername("");
    onLogin();
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
  return <CreateUserForm onLogin={onLogin} />;
};

export default CreateUser;
