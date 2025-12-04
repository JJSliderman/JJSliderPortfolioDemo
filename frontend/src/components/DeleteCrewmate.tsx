import { useState } from "react";
import { useDeleteCrewmate } from "../actions/DemoAction";
import { TextInput } from "./TemplateComponent";
import { TextField } from "@mui/material";

type DeleteType = {
  closeMethod: () => void;
  selectedCrewmate: {
    name: string;
    epithet: string;
    enlistment: Date | null;
    teamname: string;
    color: string;
    retired: boolean;
  };
};

export const DeleteCrewmate = ({
  closeMethod,
  selectedCrewmate,
}: DeleteType) => {
  const [deletedMember, setDeletedMember] = useState<TextInput>({
    value: "",
    error: false,
    helperText: "Enter name of crew member to remove",
  });
  const deleter = useDeleteCrewmate(
    closeMethod,
    selectedCrewmate.name,
    selectedCrewmate.teamname
  );

  const crewDeletion = () => {
    deleter.mutate();
  };

  return (
    <div className="w-[300px] h-[350px] p-2 gap-3 flex flex-col">
      <p>
        Are you sure you want to remove {selectedCrewmate.name} from the{" "}
        {selectedCrewmate.teamname} pirates? Please type the crew member&apos;s
        name in the box to confirm.
      </p>
      <TextField
        sx={{
          width: "285px",
          "& label.Mui-focused": {
            color: deletedMember.error ? "#D3261A" : "#3B82F6",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: deletedMember.error ? "#D3261A" : "#3B82F6",
            },
          },
        }}
        label="Removed Member"
        placeholder="Crew Member to Remove"
        helperText={deletedMember.helperText}
        value={deletedMember.value}
        error={deletedMember.error}
        onChange={(event) => {
          setDeletedMember({ ...deletedMember, value: event.target.value });
        }}
        onBlur={() => {
          if (
            deletedMember.value === "" ||
            deletedMember.value !== selectedCrewmate.name
          ) {
            setDeletedMember({
              ...deletedMember,
              error: true,
              helperText:
                "Must be the same as crew member name you wish to remove!",
            });
          } else {
            setDeletedMember({
              ...deletedMember,
              error: false,
              helperText: "Enter name of crew member to remove",
            });
          }
        }}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          title="Remove"
          disabled={
            deletedMember.error || deletedMember.value !== selectedCrewmate.name
          }
          className="border h-7 w-[60px] border-blue-500 cursor-pointer disabled:cursor-auto disabled:bg-gray-500 disabled:border-gray-800"
          data-testid="remove"
          onClick={() => {
            crewDeletion();
          }}
        >
          Yes
        </button>
        <button
          type="button"
          title="Cancel"
          className="border h-7 w-[60px] border-blue-500 cursor-pointer"
          data-testid="remove-cancel"
          onClick={() => {
            closeMethod();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};
