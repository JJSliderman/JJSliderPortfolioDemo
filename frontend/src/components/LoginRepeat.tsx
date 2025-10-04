import { useLastDemo } from "../actions/DemoAction";
import { ErrorPhrase, ExpiredPhrase, LoadingPhrase } from "./GenericPhrases";
import { TextInput } from "./TemplateComponent";
import { LoginRepeatFields } from "./LoginRepeatFields";

export const LoginRepeat = () => {
  const refresher = useLastDemo();
  const handleSubmit = (
    username: TextInput,
    password: TextInput,
    elementSet: (value: string) => void
  ) => {
    if (
      username.value !== "" &&
      !username.error &&
      password.value !== "" &&
      !password.error
    ) {
      refresher.mutate({ username: username.value, password: password.value });
    } else if (username.value === "" && password.value !== "") {
      elementSet("username");
    } else if (password.value === "" && username.value !== "") {
      elementSet("password");
    } else {
      elementSet("userPass");
    }
  };
  if (refresher.status === "error") {
    return (
      <div className="flex flex-col gap-4 pt-3 text-center items-center">
        <ErrorPhrase />
        <LoginRepeatFields loginMethod={handleSubmit} />
      </div>
    );
  } else if (refresher.status === "pending") {
    return <LoadingPhrase />;
  } else if (refresher.status === "success") {
    return null;
  }
  return (
    <div className="flex flex-col gap-4 pt-3 text-center items-center">
      <ExpiredPhrase />
      <LoginRepeatFields loginMethod={handleSubmit} />
    </div>
  );
};
