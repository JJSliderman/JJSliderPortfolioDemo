import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BaseElementType = {
  close: () => void;
  condition?: boolean;
  conditionText?: string;
};

export const BaseType = ({
  close,
  condition,
  conditionText,
}: BaseElementType) => {
  if (condition && conditionText) {
    return (
      <div className="flex justify-between">
        <p className="text-xl font-medium">
          {condition ? `Edit ${conditionText}` : `Create ${conditionText}`}
        </p>
        <button
          type="button"
          onClick={close}
          className="size-[25px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faX} size="lg" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={close}
        className="size-[25px] cursor-pointer"
      >
        <FontAwesomeIcon icon={faX} size="lg" />
      </button>
    </div>
  );
};
