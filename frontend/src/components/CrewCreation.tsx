import { useState } from "react";
import { TextInput } from "./TemplateComponent";
import { TextField } from "@mui/material";
import { useSetCrew } from "../actions/DemoAction";
import { BaseType } from "./BaseType";

type CrewType = {
  closeMethod: () => void;
  crewname?: string;
  crewsymbol?: string;
};

export const CrewCreation = ({
  closeMethod,
  crewname,
  crewsymbol,
}: CrewType) => {
  const [name, setName] = useState<TextInput>({
    value: crewname ?? "",
    error: false,
    helperText: "",
  });
  const [symbol, setSymbol] = useState<TextInput>({
    value: crewsymbol ?? "",
    error: false,
    helperText: "",
  });

  const creation = useSetCrew(closeMethod, name.value, symbol.value);

  const crewSubmission = () => {
    if (
      !name.error &&
      name.value !== "" &&
      name.value.length <= 100 &&
      !symbol.error &&
      symbol.value !== "" &&
      symbol.value.length <= 100
    ) {
      creation.mutate();
    }
  };

  return (
    <div className="w-[300px] h-[300px] p-2 gap-3 flex flex-col">
      <BaseType
        close={closeMethod}
        condition={crewname !== undefined && crewsymbol !== undefined}
        conditionText="Crew"
      />
      <div className="gap-5 flex flex-col">
        <TextField
          sx={{
            width: "285px",
            "& label.Mui-focused": {
              color: name.error ? "#D3261A" : "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: name.error ? "#D3261A" : "#3B82F6",
              },
            },
          }}
          helperText={name.helperText}
          value={name.value}
          error={name.error}
          label="Crew Name"
          placeholder="Enter crew name"
          onChange={(event) => {
            setName({ ...name, value: event.target.value });
          }}
          onBlur={() => {
            if (name.value === "" || name.value.length > 100) {
              setName({
                ...name,
                error: true,
                helperText: "Must be non-null and less than 100 characters!",
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
        <TextField
          sx={{
            width: "285px",
            "& label.Mui-focused": {
              color: symbol.error ? "#D3261A" : "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: symbol.error ? "#D3261A" : "#3B82F6",
              },
            },
          }}
          helperText={symbol.helperText}
          label="Crew Symbol"
          placeholder="Enter crew symbol"
          value={symbol.value}
          error={symbol.error}
          onChange={(event) => {
            setSymbol({ ...symbol, value: event.target.value });
          }}
          onBlur={() => {
            if (symbol.value === "" || symbol.value.length > 100) {
              setSymbol({
                ...symbol,
                error: true,
                helperText: "Must be non-null and less than 100 characters!",
              });
            } else {
              setSymbol({
                ...symbol,
                error: false,
                helperText: "",
              });
            }
          }}
        />
        <button
          type="button"
          title="Submit"
          className="border w-[285px] border-blue-500 cursor-pointer disabled:cursor-auto h-10 disabled:bg-gray-500 disabled:border-gray-800"
          data-testid="crew-creation"
          disabled={
            symbol.error ||
            symbol.value === "" ||
            symbol.value.length > 100 ||
            name.error ||
            name.value === "" ||
            name.value.length > 100
          }
          onClick={() => {
            crewSubmission();
          }}
        >
          Submit Information
        </button>
      </div>
    </div>
  );
};
