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
  }>({ name: "", epithet: "", color: "" });
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
            });
            closeMethod();
          }}
        />
        <button
          type="button"
          title="Reset Filter"
          className="border h-7 w-[100px] border-blue-500 cursor-pointer"
          data-testid="reset-name"
          onClick={() => {
            setFilter({
              ...filter,
              enlistment: null,
              name: "",
              epithet: "",
              color: "",
            });
            closeMethod();
          }}
        >
          Reset Filter
        </button>
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
            });
            closeMethod();
          }}
        />
        <button
          type="button"
          title="Reset Filter"
          className="border h-7 w-[100px] border-blue-500 cursor-pointer"
          data-testid="reset-color"
          onClick={() => {
            setFilter({
              ...filter,
              enlistment: null,
              name: "",
              epithet: "",
              color: "",
            });
            closeMethod();
          }}
        >
          Reset Filter
        </button>
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
            });
            closeMethod();
          }}
        />
        <button
          type="button"
          title="Reset Filter"
          className="border h-7 w-[100px] border-blue-500 cursor-pointer"
          data-testid="reset-epithet"
          onClick={() => {
            setFilter({
              ...filter,
              enlistment: null,
              name: "",
              epithet: "",
              color: "",
            });
            closeMethod();
          }}
        >
          Reset Filter
        </button>
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
            onChange={(newValue) => {
              setFilter({ ...filter, enlistment: newValue });
              closeMethod();
            }}
          />
        </LocalizationProvider>
        <button
          type="button"
          title="Reset Filter"
          className="border h-7 w-[100px] border-blue-500 cursor-pointer"
          data-testid="reset-enlistment"
          onClick={() => {
            setFilter({
              ...filter,
              enlistment: null,
              name: "",
              epithet: "",
              color: "",
            });
            closeMethod();
          }}
        >
          Reset Filter
        </button>
      </div>
    );
  } else if (filterType === "retired") {
    return (
      <div className="w-[300px] h-[250px] p-2 gap-3 flex flex-col">
        <BaseType close={closeMethod} />
        <div className="flex gap-1 items-center">
          <input
            type="radio"
            value="retired"
            title="Retired"
            onChange={() => {
              setFilter({ ...filter, retired: "retired" });
              closeMethod();
            }}
          />
          <p>Retired</p>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="radio"
            title="Not Retired"
            value="nonretired"
            onChange={() => {
              setFilter({ ...filter, retired: "nonretired" });
              closeMethod();
            }}
          />
          <p>Not Retired</p>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="radio"
            title="All"
            value="all"
            onChange={() => {
              setFilter({ ...filter, retired: "all" });
              closeMethod();
            }}
          />
          <p>All</p>
        </div>
      </div>
    );
  }
};
