import {
  faArrowDown,
  faArrowsUpDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SortType = {
  category: string;
  sortBy: string;
  direction: "up" | "down" | "";
};

export const SortingIcon = ({ category, sortBy, direction }: SortType) => {
  if (category === sortBy && direction === "down") {
    return <FontAwesomeIcon icon={faArrowDown} />;
  } else if (category === sortBy && direction === "up") {
    return <FontAwesomeIcon icon={faArrowUp} />;
  }
  return <FontAwesomeIcon icon={faArrowsUpDown} />;
};
