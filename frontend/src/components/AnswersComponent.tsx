// map for display, forEach for only iteration
//This is for variables you want to pass into components that you call within other components.

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "..";
import { useGetAnswers, useLastDemo } from "../actions/DemoAction";
import { characters } from "../utils/CharacterAnswers";
import { SelectedCharacter } from "./SelectedCharacter";
import { TextInput } from "./TemplateComponent";
import { useQueryClient } from "@tanstack/react-query";

export const AnswersComponent = () => {
  const refresher = useLastDemo();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<string[]>([]);
  const [radio, setRadio] = useState<TextInput>({
    value: "",
    error: false,
    helperText: "",
  });
  const { loggedInUser, setLoggedInUser, setRefresh, setAccess } =
    useContext(AuthContext);
  const { data, isPending, status } = useGetAnswers(0);
  useEffect(() => {
    if (refresher.status === "success" && loggedInUser === "") {
      setRefresh(refresher.data.refresh);
      setLoggedInUser(refresher.data.loggedInUser);
      setAccess(refresher.data.access);
      queryClient.invalidateQueries({ queryKey: ["lastDemo"] });
    }
  }, [refresher.status]);
  const handleSubmit = () => {
    if (radio.value !== "" && !radio.error) {
      setOptions([radio.value]);
    } else {
      setRadio({ ...radio, error: true, helperText: "Need a value here!" });
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

  if (isPending) {
    return <p className="pt-4">Loading...</p>;
  } else if (status === "error") {
    return <p className="pt-4">Error retrieving data...</p>;
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
