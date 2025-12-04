import { useState } from "react";
import { TextInput } from "./TemplateComponent";
import { TextField } from "@mui/material";
import { useSetCrewmate } from "../actions/DemoAction";
import { BaseType } from "./BaseType";

type CrewType = {
  closeMethod: () => void;
  crewmate?: {
    name: string;
    epithet: string;
    enlistment: Date | null;
    teamname: string;
    color: string;
    retired: boolean;
  };
  teamName: string;
};

export const CrewmateCreation = ({
  closeMethod,
  crewmate,
  teamName,
}: CrewType) => {
  const [name, setName] = useState<TextInput>({
    value: crewmate?.name ?? "",
    error: false,
    helperText: "",
  });
  const [color, setColor] = useState<TextInput>({
    value: crewmate?.color ?? "",
    error: false,
    helperText: "",
  });
  const [epithet, setEpithet] = useState<TextInput>({
    value: crewmate?.epithet ?? "",
    error: false,
    helperText: "",
  });

  const creation = useSetCrewmate(
    closeMethod,
    name.value,
    epithet.value,
    teamName,
    color.value,
    crewmate?.name ?? ""
  );

  const crewSubmission = () => {
    if (
      !name.error &&
      name.value !== "" &&
      name.value.length <= 100 &&
      !epithet.error &&
      epithet.value !== "" &&
      epithet.value.length <= 100 &&
      !color.error &&
      color.value !== "" &&
      color.value.length <= 100
    ) {
      creation.mutate();
    }
  };

  return (
    <div className="w-[300px] h-[350px] p-2 gap-3 flex flex-col">
      <BaseType
        close={closeMethod}
        condition={crewmate !== undefined}
        conditionText="Crewmate"
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
          label="Name"
          placeholder="Enter crewmate name"
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
              color: color.error ? "#D3261A" : "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: color.error ? "#D3261A" : "#3B82F6",
              },
            },
          }}
          helperText={color.helperText}
          value={color.value}
          error={color.error}
          label="Color"
          placeholder="Enter crewmate color"
          onChange={(event) => {
            setColor({ ...color, value: event.target.value });
          }}
          onBlur={() => {
            if (color.value === "" || color.value.length > 100) {
              setColor({
                ...color,
                error: true,
                helperText: "Must be non-null and less than 100 characters!",
              });
            } else {
              setColor({
                ...color,
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
              color: epithet.error ? "#D3261A" : "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: epithet.error ? "#D3261A" : "#3B82F6",
              },
            },
          }}
          helperText={epithet.helperText}
          value={epithet.value}
          error={epithet.error}
          label="Epithet"
          placeholder="Enter crewmate epithet"
          onChange={(event) => {
            setEpithet({ ...epithet, value: event.target.value });
          }}
          onBlur={() => {
            if (epithet.value === "" || epithet.value.length > 100) {
              setEpithet({
                ...epithet,
                error: true,
                helperText: "Must be non-null and less than 100 characters!",
              });
            } else {
              setEpithet({
                ...epithet,
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
          data-testid="crewmate-creation"
          disabled={
            color.error ||
            color.value === "" ||
            color.value.length > 100 ||
            name.error ||
            name.value === "" ||
            name.value.length > 100 ||
            epithet.error ||
            epithet.value === "" ||
            epithet.value.length > 100
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
