// map for display, forEach for only iteration
//This is for variables you want to pass into components that you call within other components.

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "..";
import { useGetAnswers, useLastDemo } from "../actions/DemoAction";
import { characters } from "../utils/CharacterAnswers";
import { SelectedCharacter } from "./SelectedCharacter";
import { TextInput } from "./TemplateComponent";
import { useQueryClient } from "@tanstack/react-query";
import { TextField } from "@mui/material";

export const AnswersComponent = () => {
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
  const { loggedInUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<string[]>([]);
  const [radio, setRadio] = useState<TextInput>({
    value: "",
    error: false,
    helperText: "",
  });
  const { data, isPending, status } = useGetAnswers(0);
  const handleSubmit = () => {
    if (radio.value !== "" && !radio.error) {
      setOptions([radio.value]);
    } else {
      setRadio({ ...radio, error: true, helperText: "Need a value here!" });
    }
  };
  const handleSubmitInformation = () => {
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
  const characterPick = () => {
    if (status === "success") {
      const matchAmount = [];
      for (let i = 0; i < characters.length; i++) {
        const match = data.answers.filter((item) =>
          characters[i].selection.includes(item)
        ).length;
        matchAmount.push({ character: characters[i].character, amount: match });
      }
      matchAmount.sort((a, b) => {
        if (a.amount < b.amount) {
          return -1;
        } else if (b.amount < a.amount) {
          return 1;
        }
        return 0;
      });
      const topMatch = matchAmount[matchAmount.length - 1].amount;
      const topPicks = matchAmount.filter((match) => match.amount === topMatch);
      setOptions(
        topPicks.map((item) => {
          return item.character;
        })
      );
      queryClient.invalidateQueries({ queryKey: ["answers", loggedInUser] });
    }
  };

  useEffect(() => {
    if (status === "success") {
      characterPick();
    }
  }, [status]);

  if (isPending || refresher.status === "pending") {
    return <p className="pt-4">Loading...</p>;
  } else if (status === "error" && loggedInUser !== "") {
    return <p className="pt-4">Error retrieving data...</p>;
  } else if (refresher.status !== "success" && status !== "success") {
    return (
      <div className="flex flex-col gap-4 pt-3 text-center items-center">
        <p>Login information has expired, please enter it again.</p>
        <TextField
          helperText={username.helperText}
          value={username.value}
          sx={{ width: "300px" }}
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
          sx={{ width: "300px" }}
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
            handleSubmitInformation();
          }}
        >
          Submit Information
        </button>
      </div>
    );
  }
  if (options.length > 1) {
    return (
      <div className="flex flex-col gap-2 pt-4">
        <p>
          Since you have multiple potential options, select which Straw Hat you
          feel best suits you from this list.
        </p>
        <div className="flex flex-col">
          {options.map((option, index) => {
            return (
              <div key={`radio-${index}`} className="flex gap-2 items-center">
                <input
                  title={option}
                  type="radio"
                  checked={radio.value === option}
                  value={option}
                  onChange={() => {
                    setRadio({
                      ...radio,
                      value: option,
                      error: false,
                      helperText: "",
                    });
                  }}
                />
                <p>{option}</p>
              </div>
            );
          })}
          <button
            type="button"
            title="Submit Choice"
            className="border-1 w-[300px] border-blue-500 cursor-pointer disabled:cursor-auto h-10 disabled:bg-gray-500 disabled:border-gray-800"
            data-testid="changer"
            disabled={radio.value === "" || radio.error}
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit Choice
          </button>
        </div>
      </div>
    );
  } else if (options.length === 1) {
    return (
      <div className="flex flex-col gap-2 pt-4 items-center">
        <p>Congratulations! Your straw hat partner is...</p>
        <SelectedCharacter topPick={options[0]} />
      </div>
    );
  }
  return <p className="pt-4">No result</p>;
};
