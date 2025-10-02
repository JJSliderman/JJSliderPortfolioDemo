import { Step, StepLabel, Stepper, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { questionsAnswers } from "../utils/CharacterAnswers";
import { useGetAnswers, useLastDemo, useSetDemo } from "../actions/DemoAction";
import { AuthContext } from "..";
import { useQueryClient } from "@tanstack/react-query";

export type TextInput = { value: string; error: boolean; helperText: string };

type OptionType = {
  type: string;
  options: string[];
  name: TextInput;
  setName: (value: TextInput) => void;
  radio: TextInput;
  setRadio: (value: TextInput) => void;
};

const QuestionOptions = ({
  type,
  options,
  name,
  setName,
  radio,
  setRadio,
}: OptionType) => {
  if (type === "radio") {
    return (
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
        <p className="text-red-500">{radio.helperText}</p>
      </div>
    );
  } else if (type === "checkbox") {
    return (
      <div className="flex flex-col">
        {options.map((option, index) => {
          return (
            <div key={`radio-${index}`} className="flex gap-2 items-center">
              <input
                type="checkbox"
                title={option}
                value={option}
                key={`radio-${index}`}
              />
              <p>{option}</p>
            </div>
          );
        })}
      </div>
    );
  } else if (type === "text") {
    return (
      <TextField
        label="Answer"
        placeholder="Enter Value"
        helperText={name.helperText}
        value={name.value}
        error={name.error}
        onChange={(event) => {
          setName({ ...name, value: event.target.value });
        }}
        onBlur={() => {
          if (name.value === "") {
            setName({
              ...name,
              error: true,
              helperText: "Must be non-null!",
            });
          } else {
            setName({
              ...name,
              error: false,
              helperText: "",
            });
          }
        }}
      />
    );
  }
  return null;
};

export const TemplateComponent = () => {
  const [step, setStep] = useState(0);
  const refresher = useLastDemo();
  const queryClient = useQueryClient();
  const { loggedInUser, setLoggedInUser, setRefresh, setAccess } =
    useContext(AuthContext);
  const { data, status, isPending } = useGetAnswers(step);
  const [text, setText] = useState<TextInput>({
    value: status === "success" ? data.answers[step] : "",
    error: false,
    helperText: "",
  });
  const [radio, setRadio] = useState<TextInput>({
    value: status === "success" ? data.answers[step] : "",
    error: false,
    helperText: "",
  });
  const stepChange = () => {
    setStep(step + 1);
    setText({
      value: data && data.status === "success" ? data.answers[step] : "",
      error: false,
      helperText: "",
    });
    setRadio({
      value: data && data.status === "success" ? data.answers[step] : "",
      error: false,
      helperText: "",
    });
  };
  const demoSet = useSetDemo(step, questionsAnswers.length - 1, stepChange);

  useEffect(() => {
    if (refresher.status === "success" && loggedInUser === "") {
      setRefresh(refresher.data.refresh);
      setLoggedInUser(refresher.data.loggedInUser);
      setAccess(refresher.data.access);
      queryClient.invalidateQueries({ queryKey: ["lastDemo"] });
    }
  }, [refresher.status]);

  useEffect(() => {
    if (status === "success") {
      setText({ ...text, value: data.answers[step] });
      setRadio({ ...radio, value: data.answers[step] });
      queryClient.invalidateQueries({
        queryKey: ["answers", loggedInUser, step],
      });
    }
  }, [data]);

  const handleNextStep = (type: string) => {
    if (
      ((type === "radio" && radio.value !== "" && !radio.error) ||
        (type === "text" && !text.error && text.value !== "")) &&
      step === questionsAnswers.length - 1
    ) {
      demoSet.mutate(type === "radio" ? radio.value : text.value);
    } else if (
      (type === "radio" && radio.value !== "" && !radio.error) ||
      (type === "text" && !text.error && text.value !== "")
    ) {
      demoSet.mutate(type === "radio" ? radio.value : text.value);
    } else if (type === "radio") {
      setRadio({ ...radio, error: true, helperText: "Need a value here" });
    } else if (type === "text") {
      setText({ ...text, error: true, helperText: "Need a value here" });
    }
  };
  if (isPending) {
    return <p className="pt-4">Loading...</p>;
  } else if (status === "error") {
    return <p className="pt-4">Error retrieving data...</p>;
  }
  return (
    <div className="flex flex-col gap-4 pt-3">
      <div className="flex justify-evenly">
        <div />
        <p>User: {loggedInUser}</p>
        <div />
      </div>
      <Stepper activeStep={step}>
        {questionsAnswers.map((stage, index) => (
          <Step index={index} key={`stage-${index}`} active={step === index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <p>
        {step + 1}. {questionsAnswers[step].question}
      </p>
      <QuestionOptions
        type={questionsAnswers[step].type}
        name={text}
        setName={setText}
        radio={radio}
        setRadio={setRadio}
        options={questionsAnswers[step].options}
      />
      <button
        type="button"
        id="next"
        disabled={isPending}
        data-testid="next"
        className="w-[150px] border-1 border-blue-500 cursor-pointer"
        color="secondary"
        onClick={() => handleNextStep(questionsAnswers[step].type)}
      >
        Next
      </button>
      <button
        type="button"
        id="prev"
        disabled={step === 0}
        className="w-[150px] border-1 cursor-pointer disabled:cursor-auto border-blue-500 disabled:bg-gray-400 disabled:border-gray-800"
        data-testid="prev"
        color="secondary"
        onClick={() => {
          setStep(step - 1);
        }}
      >
        Previous
      </button>
    </div>
  );
};
