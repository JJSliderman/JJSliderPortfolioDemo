import { useState } from "react";
import { TextInput } from "./TemplateComponent";
import { TextField } from "@mui/material";

type RepeatType = {
  loginMethod: (
    username: TextInput,
    password: TextInput,
    elementSet: (value: string) => void
  ) => void;
};

export const LoginRepeatFields = ({ loginMethod }: RepeatType) => {
  const [username, setUsername] = useState<TextInput>({
    value: "",
    error: false,
    helperText: "",
  });
  const [password, setPassword] = useState<TextInput>({
    value: "",
    error: false,
    helperText: "",
  });
  const elementSet = (value: string) => {
    if (value === "username") {
      setUsername({
        ...username,
        error: true,
        helperText: "Must be non-null!",
      });
    } else if (value === "password") {
      setPassword({
        ...password,
        error: true,
        helperText: "Must be non-null!",
      });
    } else {
      setPassword({
        ...password,
        error: true,
        helperText: "Must be non-null!",
      });
      setUsername({
        ...username,
        error: true,
        helperText: "Must be non-null!",
      });
    }
  };
  return (
    <>
      <TextField
        sx={{ width: "300px" }}
        helperText={username.helperText}
        value={username.value}
        error={username.error}
        label="Username"
        placeholder="Enter username"
        onChange={(event) => {
          setUsername({ ...username, value: event.target.value });
        }}
        onBlur={() => {
          if (username.value === "") {
            setUsername({
              ...username,
              error: true,
              helperText: "Must be non-null!",
            });
          } else {
            setUsername({
              ...username,
              error: false,
              helperText: "",
            });
          }
        }}
      />
      <TextField
        sx={{ width: "300px" }}
        helperText={password.helperText}
        label="Password"
        placeholder="Enter password"
        value={password.value}
        error={password.error}
        onChange={(event) => {
          setPassword({ ...password, value: event.target.value });
        }}
        onBlur={() => {
          if (password.value === "") {
            setPassword({
              ...password,
              error: true,
              helperText: "Must be non-null!",
            });
          } else {
            setPassword({
              ...password,
              error: false,
              helperText: "",
            });
          }
        }}
      />
      <button
        type="button"
        title="Submit Information"
        className="border-1 w-[300px] border-blue-500 cursor-pointer disabled:cursor-auto h-10 disabled:bg-gray-500 disabled:border-gray-800"
        data-testid="changer"
        disabled={
          username.error ||
          username.value === "" ||
          password.error ||
          password.value === ""
        }
        onClick={() => {
          loginMethod(username, password, elementSet);
        }}
      >
        Submit Information
      </button>
    </>
  );
};
