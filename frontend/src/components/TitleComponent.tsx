import { TextField } from "@mui/material";
import { TextInput } from "./TemplateComponent";
import { useState } from "react";
import { useLogin } from "../actions/DemoAction";

export const TitleComponent = () => {
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
  const loginSet = useLogin(username.value, password.value);

  const handlePageChange = () => {
    if (
      username.value !== "" &&
      !username.error &&
      password.value !== "" &&
      !password.error
    ) {
      loginSet.mutate();
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
  return (
    <div className="flex justify-evenly">
      <div />
      <div className="flex flex-col my-2.5 gap-4 text-center w-[400px]">
        <div>
          Welcome to the App! Enter your username and password, then hit the
          button to begin working!
        </div>
        <TextField
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
          title="Change Page"
          className="border-1 border-blue-500 cursor-pointer disabled:cursor-auto h-10 disabled:bg-gray-500 disabled:border-gray-800"
          data-testid="changer"
          disabled={
            username.error ||
            username.value === "" ||
            password.error ||
            password.value === ""
          }
          onClick={() => {
            handlePageChange();
          }}
        >
          Change Page
        </button>
      </div>
      <div />
    </div>
  );
};
