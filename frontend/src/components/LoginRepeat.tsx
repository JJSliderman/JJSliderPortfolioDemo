import { useState } from "react";
import { useLastDemo } from "../actions/DemoAction";
import { TextInput } from "./TemplateComponent";
import { TextField } from "@mui/material";
import { ErrorPhrase, LoadingPhrase } from "./GenericPhrases";

export const LoginRepeat = () => {
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
  const refresher = useLastDemo(username.value, password.value);
  const handleSubmit = () => {
    if (
      username.value !== "" &&
      !username.error &&
      password.value !== "" &&
      !password.error
    ) {
      refresher.mutate();
    }
    if (username.value === "") {
      setUsername({
        ...username,
        error: true,
        helperText: "Value must be non-null",
      });
    }
    if (password.value === "") {
      setPassword({
        ...password,
        error: true,
        helperText: "Value must be non-null",
      });
    }
  };
  if (refresher.status === "error") {
    return <ErrorPhrase />;
  } else if (refresher.status === "pending") {
    return <LoadingPhrase />;
  } else if (refresher.status === "success") {
    return null;
  }
  return (
    <div className="flex flex-col gap-4 pt-3 text-center items-center">
      <p>Login information has expired, please enter it again.</p>
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
          handleSubmit();
        }}
      >
        Submit Information
      </button>
    </div>
  );
};
