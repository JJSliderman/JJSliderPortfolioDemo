import { useLogin } from "../actions/DemoAction";
import { ErrorPhrase, LoadingPhrase } from "./GenericPhrases";
import { TextInput } from "./TemplateComponent";
import { LoginRepeatFields } from "./LoginRepeatFields";

export const LoginRepeat = () => {
  const refresher = useLogin();
  const handleSubmit = (
    username: TextInput,
    password: TextInput,
    elementSet: (value: string) => void
  ) => {
    if (
      username.value !== "" &&
      username.value.length <= 100 &&
      !username.error &&
      password.value !== "" &&
      password.value.length <= 100 &&
      !password.error
    ) {
      refresher.mutate({ username: username.value, password: password.value });
    } else if (
      (username.value === "" || username.value.length > 100) &&
      password.value !== "" &&
      password.value.length <= 100
    ) {
      elementSet("username");
    } else if (
      (password.value === "" || password.value.length > 100) &&
      username.value !== "" &&
      username.value.length <= 100
    ) {
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
    <div className="flex justify-evenly">
      <div />
      <div className="flex flex-col my-2.5 gap-4 text-center items-center w-[400px]">
        <div>
          Welcome to the App! Enter your username and password, then hit the
          button to begin working!
        </div>
        <LoginRepeatFields loginMethod={handleSubmit} />
      </div>
      <div />
    </div>
  );
};
