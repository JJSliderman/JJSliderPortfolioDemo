import { useRetireCrewmate } from "../actions/DemoAction";
import { BaseType } from "./BaseType";

type RetireType = {
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

export const RetireCrewmate = ({
  closeMethod,
  selectedCrewmate,
}: RetireType) => {
  const retire = useRetireCrewmate(
    closeMethod,
    selectedCrewmate.name,
    selectedCrewmate.teamname
  );

  const crewRetirement = () => {
    retire.mutate();
  };

  return (
    <div className="w-[200px] h-[200px] p-2 gap-3 flex flex-col">
      <BaseType close={closeMethod} />
      <p>
        Are you sure you want to{" "}
        {selectedCrewmate.retired ? "rehire" : "retire"} {selectedCrewmate.name}
        ? You can alter this decision any time.
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          title="Retire"
          className="border h-7 w-[60px] border-blue-500 cursor-pointer"
          data-testid="retire"
          onClick={() => {
            crewRetirement();
          }}
        >
          Yes
        </button>
        <button
          type="button"
          title="Cancel"
          className="border h-7 w-[60px] border-blue-500 cursor-pointer"
          data-testid="cancel"
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
