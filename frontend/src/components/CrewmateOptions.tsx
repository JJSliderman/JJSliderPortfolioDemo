import { BaseType } from "./BaseType";

type OptionsType = {
  setAnchor: (value: {
    filter: HTMLElement | undefined;
    crewmateOptions: HTMLElement | undefined;
    crewmateCreation: HTMLElement | undefined;
    retirement: HTMLElement | undefined;
    deletion: HTMLElement | undefined;
    crewCreation: HTMLElement | undefined;
  }) => void;
  selectedCrewmate: {
    name: string;
    epithet: string;
    teamname: string;
    enlistment: Date | null;
    retired: boolean;
    color: string;
  };
  close: () => void;
};

export const CrewmateOptions = ({
  setAnchor,
  selectedCrewmate,
  close,
}: OptionsType) => (
  <div className="py-1 w-[150px] flex flex-col">
    <BaseType close={close} />
    <button
      type="button"
      className="cursor-pointer hover:bg-gray-400 text-left"
      onClick={(event) =>
        setAnchor({
          crewmateOptions: undefined,
          crewmateCreation: event.currentTarget,
          retirement: undefined,
          deletion: undefined,
          filter: undefined,
          crewCreation: undefined,
        })
      }
    >
      <p className="pl-1">Edit Crewmate</p>
    </button>
    <button
      type="button"
      className="cursor-pointer hover:bg-gray-400 text-left"
      onClick={(event) =>
        setAnchor({
          crewmateOptions: undefined,
          retirement: event.currentTarget,
          deletion: undefined,
          crewmateCreation: undefined,
          filter: undefined,
          crewCreation: undefined,
        })
      }
    >
      <p className="pl-1">
        {!selectedCrewmate.retired ? "Retire Crewmate" : "Rehire Crewmate"}
      </p>
    </button>
    <button
      type="button"
      className="cursor-pointer hover:bg-gray-400 text-left"
      onClick={(event) =>
        setAnchor({
          crewmateOptions: undefined,
          retirement: undefined,
          deletion: event.currentTarget,
          crewmateCreation: undefined,
          filter: undefined,
          crewCreation: undefined,
        })
      }
    >
      <p className="pl-1">Remove Crewmate</p>
    </button>
  </div>
);
