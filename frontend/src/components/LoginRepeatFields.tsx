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
        helperText: "Must be non-null and <= 100 characters!",
      });
    } else if (value === "password") {
      setPassword({
        ...password,
        error: true,
        helperText: "Must be non-null and <= 100 characters!",
      });
    } else {
      setPassword({
        ...password,
        error: true,
        helperText: "Must be non-null and <= 100 characters!",
      });
      setUsername({
        ...username,
        error: true,
        helperText: "Must be non-null and <= 100 characters!",
      });
    }
  };
  return (
    <>
      <TextField
        sx={{
          width: "300px",
          "& label.Mui-focused": {
            color: username.error ? "#D3261A" : "#3B82F6",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: username.error ? "#D3261A" : "#3B82F6",
            },
          },
        }}
        helperText={username.helperText}
        value={username.value}
        error={username.error}
        label="Username"
        placeholder="Enter username"
        onChange={(event) => {
          setUsername({ ...username, value: event.target.value });
        }}
        onBlur={() => {
          if (username.value === "" || username.value.length > 100) {
            setUsername({
              ...username,
              error: true,
              helperText: "Must be non-null and less than 100 characters!",
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
        sx={{
          width: "300px",
          "& label.Mui-focused": {
            color: password.error ? "#D3261A" : "#3B82F6",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: password.error ? "#D3261A" : "#3B82F6",
            },
          },
        }}
        helperText={password.helperText}
        label="Password"
        placeholder="Enter password"
        value={password.value}
        error={password.error}
        onChange={(event) => {
          setPassword({ ...password, value: event.target.value });
        }}
        onBlur={() => {
          if (password.value === "" || password.value.length > 100) {
            setPassword({
              ...password,
              error: true,
              helperText: "Must be non-null and less than 100 characters!",
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
        className="border w-[300px] border-blue-500 cursor-pointer disabled:cursor-auto h-10 disabled:bg-gray-500 disabled:border-gray-800"
        data-testid="login"
        disabled={
          username.error ||
          username.value === "" ||
          username.value.length > 100 ||
          password.error ||
          password.value === "" ||
          password.value.length > 100
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
