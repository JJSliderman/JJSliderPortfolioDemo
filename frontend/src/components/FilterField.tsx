import { useState } from "react";
import { BaseType } from "./BaseType";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type FilterType = {
  filterType: string;
  closeMethod: () => void;
  filter: {
    name: string;
    enlistment: Date | null;
    color: string;
    epithet: string;
    retired: string;
  };
  setFilter: (value: {
    name: string;
    enlistment: Date | null;
    color: string;
    epithet: string;
    retired: string;
  }) => void;
};

export const FilterField = ({
  filterType,
  closeMethod,
  filter,
  setFilter,
}: FilterType) => {
  const [temporaryFilter, setTemporaryFilter] = useState<{
    name: string;
    color: string;
    epithet: string;
    retired: string;
  }>({ name: "", epithet: "", color: "", retired: "all" });
  if (filterType === "name") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <TextField
          sx={{
            width: "285px",
            "& label.Mui-focused": {
              color: "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#3B82F6",
              },
            },
          }}
          helperText="Name Filter Value"
          value={temporaryFilter.name}
          label="Name Filter"
          onChange={(event) => {
            setTemporaryFilter({
              ...temporaryFilter,
              name: event.target.value,
            });
          }}
          onBlur={() => {
            setFilter({
              ...filter,
              name: temporaryFilter.name,
              epithet: temporaryFilter.epithet,
              color: temporaryFilter.color,
              retired: temporaryFilter.retired,
            });
          }}
        />
      </div>
    );
  } else if (filterType === "color") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <TextField
          sx={{
            width: "285px",
            "& label.Mui-focused": {
              color: "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#3B82F6",
              },
            },
          }}
          helperText="Color Filter Value"
          value={temporaryFilter.color}
          label="Color Filter"
          onChange={(event) => {
            setTemporaryFilter({
              ...temporaryFilter,
              color: event.target.value,
            });
          }}
          onBlur={() => {
            setFilter({
              ...filter,
              name: temporaryFilter.name,
              epithet: temporaryFilter.epithet,
              color: temporaryFilter.color,
              retired: temporaryFilter.retired,
            });
          }}
        />
      </div>
    );
  } else if (filterType === "epithet") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <TextField
          sx={{
            width: "285px",
            "& label.Mui-focused": {
              color: "#3B82F6",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#3B82F6",
              },
            },
          }}
          helperText="Epithet Filter Value"
          value={temporaryFilter.epithet}
          label="Epithet Filter"
          onChange={(event) => {
            setTemporaryFilter({
              ...temporaryFilter,
              epithet: event.target.value,
            });
          }}
          onBlur={() => {
            setFilter({
              ...filter,
              name: temporaryFilter.name,
              epithet: temporaryFilter.epithet,
              color: temporaryFilter.color,
              retired: temporaryFilter.retired,
            });
          }}
        />
      </div>
    );
  } else if (filterType === "enlistment") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            sx={{
              "& label.Mui-focused": {
                color: "#3B82F6",
              },
              "&.MuiFormControl-root.MuiPickersTextField-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3B82F6",
                },
              },
            }}
            label="Select a date"
            value={filter.enlistment}
            onChange={(newValue) =>
              setFilter({ ...filter, enlistment: newValue })
            }
          />
        </LocalizationProvider>
      </div>
    );
  } else if (filterType === "retired") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <input
          type="radio"
          value="retired"
          onChange={() => {
            setFilter({ ...filter, retired: "retired" });
          }}
        >
          Retired
        </input>
        <input
          type="radio"
          value="nonretired"
          onChange={() => {
            setFilter({ ...filter, retired: "nonretired" });
          }}
        >
          Not Retired
        </input>
        <input
          type="radio"
          value="all"
          onChange={() => {
            setFilter({ ...filter, retired: "all" });
          }}
        >
          All
        </input>
      </div>
    );
  }
};
