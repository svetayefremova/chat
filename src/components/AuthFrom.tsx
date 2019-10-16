import useForm from "rc-form-hooks";
import React, { useState } from "react";

const style: any = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const AuthForm = ({ onSubmit, buttonText }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { getFieldDecorator, validateFields } = useForm<{
    username: string;
    password: string;
  }>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await validateFields();
    setUsername("");
    setPassword("");
    onSubmit(username, password);
  }

  return (
    <form onSubmit={handleSubmit} style={style.form}>
      <label>
        Username
        {getFieldDecorator("username")(
          <input type="text" onChange={(e) => setUsername(e.target.value)} />,
        )}
      </label>
      <label>
        Password
        {getFieldDecorator("password")(
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />,
        )}
      </label>
      <button type={"submit"}>{buttonText}</button>
    </form>
  );
};

export default AuthForm;
