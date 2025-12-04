import {
  Popover,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { questionsAnswers } from "../utils/CharacterAnswers";
import { useGetAnswers, useGetCrew, useSetDemo } from "../actions/DemoAction";
import { AuthContext } from "..";
import { useQueryClient } from "@tanstack/react-query";
import { LoginRepeat } from "./LoginRepeat";
import { LoadingPhrase } from "./GenericPhrases";
import { BackToDashboard } from "./BackToDashboard";
import { useNavigate } from "react-router-dom";
import { CrewCreation } from "./CrewCreation";
import { SortingIcon } from "./SortingIcon";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CrewmateCreation } from "./CrewmateCreation";
import { FilterField } from "./FilterField";
import { CrewmateOptions } from "./CrewmateOptions";
import { RetireCrewmate } from "./RetireCrewmate";
import { DeleteCrewmate } from "./DeleteCrewmate";

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
        sx={{
          width: "300px",
          "& label.Mui-focused": {
            color: name.error ? "#D3261A" : "#3B82F6",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: name.error ? "#D3261A" : "#3B82F6",
            },
          },
        }}
        label="Answer"
        placeholder="Enter Value"
        helperText={name.helperText}
        value={name.value}
        error={name.error}
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
    );
  }
  return null;
};

export const TemplateComponent = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOccurred, setEditOccurred] = useState(false);
  const [filter, setFilter] = useState<{
    name: string;
    enlistment: Date | null;
    color: string;
    epithet: string;
    retired: string;
  }>({ name: "", enlistment: null, epithet: "", color: "", retired: "all" });
  const [direction, setDirection] = useState<"" | "up" | "down">("");
  const [sortBy, setSortBy] = useState("");
  const [anchor, setAnchor] = useState<{
    crewCreation: HTMLElement | undefined;
    crewmateOptions: HTMLElement | undefined;
    crewmateCreation: HTMLElement | undefined;
    filter: HTMLElement | undefined;
    retirement: HTMLElement | undefined;
    deletion: HTMLElement | undefined;
  }>({
    crewCreation: undefined,
    crewmateOptions: undefined,
    crewmateCreation: undefined,
    filter: undefined,
    retirement: undefined,
    deletion: undefined,
  });
  const [rowser, setRowser] = useState(10);
  const [filterType, setFilterType] = useState("");
  const [pager, setPager] = useState(0);
  const { loggedInUser } = useContext(AuthContext);
  const { data, status, isPending } = useGetAnswers(step);
  const [selectedCrewmate, setSelectedCrewmate] = useState<{
    name: string;
    epithet: string;
    teamname: string;
    enlistment: Date | null;
    retired: boolean;
    color: string;
  }>({
    name: "",
    enlistment: null,
    teamname: "",
    retired: false,
    color: "",
    epithet: "",
  });
  const crewRetrieval = useGetCrew(
    filter,
    sortBy,
    direction,
    pager,
    rowser,
    editOccurred
  );
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
  // onPageChange and onRowsPerPageChange aren't changer methods, they're methods called when hitting changer buttons
  const handlePageChange = (newPage: number) => {
    setPager(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowser(Number(event.target.value));
    setPager(0);
  };

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
  // rm -rf node_modules package-lock.json
  // @latest installs latest version of whatever component is being installed
  // npm cache clean --force to fix npm install issues
  // npm install @mui/material@^6.0.0 react@^18.0.0 react-dom@^18.0.0 for mui/x-date-pickers
  // npm install @mui/x-date-pickers@latest @mui/x-date-pickers-pro@latest date-fns@latest for latest date pickers and dateFNs version
  const sortChange = (value: string) => {
    setSortBy(value);
    if (direction === "" || direction === "up") {
      setDirection("down");
    } else {
      setDirection("up");
    }
  };

  useEffect(() => {
    if (loggedInUser === "") {
      navigate("/dashboard", { replace: true });
    }
    if (status === "success") {
      setText({ ...text, value: data.answers[step] });
      setRadio({ ...radio, value: data.answers[step] });
      queryClient.invalidateQueries({
        queryKey: ["answers", loggedInUser, step],
      });
    }
  }, [data]);

  const closeMethod = () => {
    setAnchor({
      crewCreation: undefined,
      crewmateOptions: undefined,
      crewmateCreation: undefined,
      filter: undefined,
      retirement: undefined,
      deletion: undefined,
    });
    setEditOccurred(!editOccurred);
    setSelectedCrewmate({
      name: "",
      epithet: "",
      teamname: "",
      enlistment: null,
      retired: false,
      color: "",
    });
  };

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
  if (isPending || crewRetrieval.isPending) {
    return <LoadingPhrase />;
  } else if (status === "error" && loggedInUser !== "") {
    return <BackToDashboard />;
  } else if (status !== "success") {
    return <LoginRepeat />;
  }
  return (
    <div className="flex flex-col gap-4 pt-3">
      <div className="flex justify-evenly">
        <div />
        <p>User: {loggedInUser}</p>
        <div />
      </div>
      <div className="flex justify-evenly">
        <div />
        {crewRetrieval.status === "success" &&
        crewRetrieval.data.crew.name !== "" ? (
          <button
            type="button"
            className="border border-blue-500 cursor-pointer w-[300px]"
            onClick={(event) =>
              setAnchor({
                crewCreation: event.currentTarget,
                crewmateOptions: undefined,
                crewmateCreation: undefined,
                filter: undefined,
                retirement: undefined,
                deletion: undefined,
              })
            }
          >
            Edit Crew
          </button>
        ) : (
          <button
            type="button"
            className="border border-blue-500 cursor-pointer w-[300px]"
            onClick={(event) =>
              setAnchor({
                crewCreation: event.currentTarget,
                crewmateOptions: undefined,
                crewmateCreation: undefined,
                filter: undefined,
                retirement: undefined,
                deletion: undefined,
              })
            }
          >
            Create Crew
          </button>
        )}
        <div />
      </div>
      <Popover anchorEl={anchor.crewCreation} open={!!anchor.crewCreation}>
        <CrewCreation
          closeMethod={closeMethod}
          crewname={crewRetrieval.data?.crew.name}
          crewsymbol={crewRetrieval.data?.crew.symbol}
        />
      </Popover>
      <Popover
        anchorEl={anchor.crewmateCreation}
        open={!!anchor.crewmateCreation}
      >
        <CrewmateCreation
          closeMethod={closeMethod}
          crewmate={selectedCrewmate}
          teamName={crewRetrieval.data?.crew.name ?? ""}
        />
      </Popover>
      <Popover anchorEl={anchor.filter} open={!!anchor.filter}>
        <FilterField
          filter={filter}
          setFilter={setFilter}
          closeMethod={closeMethod}
          filterType={filterType}
        />
      </Popover>
      <Popover
        anchorEl={anchor.crewmateOptions}
        open={!!anchor.crewmateOptions}
      >
        <CrewmateOptions
          setAnchor={setAnchor}
          selectedCrewmate={selectedCrewmate}
          close={closeMethod}
        />
      </Popover>
      <Popover anchorEl={anchor.retirement} open={!!anchor.retirement}>
        <RetireCrewmate
          selectedCrewmate={selectedCrewmate}
          closeMethod={closeMethod}
        />
      </Popover>
      <Popover anchorEl={anchor.deletion} open={!!anchor.deletion}>
        <DeleteCrewmate
          selectedCrewmate={selectedCrewmate}
          closeMethod={closeMethod}
        />
      </Popover>
      <div className="flex justify-evenly">
        <div />
        {crewRetrieval.status === "success" ? (
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium">
              Crew Name: {crewRetrieval.data.crew.name}
            </p>
            <p className="text-lg font-medium">
              Crew Symbol: {crewRetrieval.data.crew.symbol}
            </p>
          </div>
        ) : (
          <div />
        )}
        <div />
      </div>
      <div className="flex justify-evenly">
        <div />
        {crewRetrieval.status === "success" ? (
          <button
            type="button"
            className="border border-blue-500 cursor-pointer w-[300px]"
            onClick={(event) =>
              setAnchor({
                crewCreation: undefined,
                crewmateOptions: undefined,
                crewmateCreation: event.currentTarget,
                filter: undefined,
                retirement: undefined,
                deletion: undefined,
              })
            }
          >
            Create Crewmate
          </button>
        ) : (
          <div />
        )}
        <div />
      </div>
      {crewRetrieval.status === "success" ? (
        <Table sx={{ border: "1px solid #E5E7EB" }}>
          <TableHead sx={{ border: "1px solid #E5E7EB" }}>
            <TableRow>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      sortChange("name");
                    }}
                  >
                    <SortingIcon
                      category="name"
                      sortBy={sortBy}
                      direction={direction}
                    />
                  </button>
                  Name
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      setFilterType("name");
                      setAnchor({
                        crewCreation: undefined,
                        crewmateOptions: undefined,
                        crewmateCreation: undefined,
                        filter: event.currentTarget,
                        retirement: undefined,
                        deletion: undefined,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      sortChange("epithet");
                    }}
                  >
                    <SortingIcon
                      category="epithet"
                      sortBy={sortBy}
                      direction={direction}
                    />
                  </button>
                  Epithet
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      setFilterType("epithet");
                      setAnchor({
                        crewCreation: undefined,
                        crewmateOptions: undefined,
                        crewmateCreation: undefined,
                        filter: event.currentTarget,
                        retirement: undefined,
                        deletion: undefined,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      sortChange("color");
                    }}
                  >
                    <SortingIcon
                      category="color"
                      sortBy={sortBy}
                      direction={direction}
                    />
                  </button>
                  Color
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      setFilterType("color");
                      setAnchor({
                        crewCreation: undefined,
                        crewmateOptions: undefined,
                        crewmateCreation: undefined,
                        filter: event.currentTarget,
                        retirement: undefined,
                        deletion: undefined,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      sortChange("enlistment");
                    }}
                  >
                    <SortingIcon
                      category="enlistment"
                      sortBy={sortBy}
                      direction={direction}
                    />
                  </button>
                  Enlistment (UTC)
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      setFilterType("enlistment");
                      setAnchor({
                        crewCreation: undefined,
                        crewmateOptions: undefined,
                        crewmateCreation: undefined,
                        filter: event.currentTarget,
                        retirement: undefined,
                        deletion: undefined,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      sortChange("retired");
                    }}
                  >
                    <SortingIcon
                      category="retired"
                      sortBy={sortBy}
                      direction={direction}
                    />
                  </button>
                  Retired?
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(event) => {
                      setFilterType("retired");
                      setAnchor({
                        crewCreation: undefined,
                        crewmateOptions: undefined,
                        crewmateCreation: undefined,
                        filter: event.currentTarget,
                        retirement: undefined,
                        deletion: undefined,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ border: "1px solid #E5E7EB" }}>
            {crewRetrieval.data.crewmates.map((crewmate, index) => (
              <TableRow
                className="hover:bg-gray-200 cursor-pointer"
                key={`${crewmate.name}-${crewmate.enlistment.toLocaleString(
                  "en-us",
                  { day: "2-digit", month: "2-digit", year: "numeric" }
                )}-${index}`}
                onClick={(event) => {
                  setAnchor({
                    crewCreation: undefined,
                    crewmateOptions: event.currentTarget,
                    crewmateCreation: undefined,
                    filter: undefined,
                    retirement: undefined,
                    deletion: undefined,
                  });
                  setSelectedCrewmate(crewmate);
                }}
              >
                <TableCell sx={{ pl: 4.5 }}>{crewmate.name}</TableCell>
                <TableCell sx={{ pl: 4.5 }}>{crewmate.epithet}</TableCell>
                <TableCell sx={{ pl: 4.5 }}>{crewmate.color}</TableCell>
                <TableCell sx={{ pl: 4.5 }}>
                  {crewmate.enlistment.toLocaleString("en-us", {
                    timeZone: "utc",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell sx={{ pl: 4.5 }}>
                  <div
                    className={`border w-[60px] h-7 text-center rounded-full ${
                      crewmate.retired
                        ? "bg-red-400 border-red-600"
                        : "bg-blue-400 border-blue-600"
                    }`}
                  >
                    <p className="pt-0.5">
                      {crewmate.retired ? "Retired" : "Active"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TablePagination
            onPageChange={(event, page) => handlePageChange(page)}
            count={crewRetrieval.data.count}
            rowsPerPage={rowser}
            page={pager}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Table>
      ) : (
        <div />
      )}
      <Stepper activeStep={step}>
        {questionsAnswers.map((stage, index) => (
          <Step
            sx={{
              "& .MuiStepIcon-root": {
                "&.Mui-completed": { color: "#3B82F69F" },
                "&.Mui-active": { color: "#3B82F6" },
              },
            }}
            index={index}
            key={`stage-${index}`}
            active={step === index}
          >
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
        className="w-[150px] border border-blue-500 cursor-pointer"
        color="secondary"
        onClick={() => handleNextStep(questionsAnswers[step].type)}
      >
        Next
      </button>
      <button
        type="button"
        id="prev"
        disabled={step === 0}
        className="w-[150px] border cursor-pointer disabled:cursor-auto border-blue-500 disabled:bg-gray-400 disabled:border-gray-800"
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
