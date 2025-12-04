import { useNavigate } from "react-router";
import { ErrorPhrase } from "./GenericPhrases";

export const BackToDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 pt-3 text-center items-center">
      <ErrorPhrase />
      <button
        type="button"
        id="back-to-dashboard"
        className="w-[400px] border cursor-pointer disabled:cursor-auto border-blue-500 disabled:bg-gray-400 disabled:border-gray-800"
        data-testid="prev"
        color="secondary"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Go To Dashboard
      </button>
    </div>
  );
};
