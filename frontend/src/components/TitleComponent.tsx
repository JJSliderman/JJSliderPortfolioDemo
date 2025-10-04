import { TextInput } from "./TemplateComponent";
import { useLogin } from "../actions/DemoAction";
import { LoginRepeatFields } from "./LoginRepeatFields";

export const TitleComponent = () => {
  const loginSet = useLogin();

  const handlePageChange = (
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
      loginSet.mutate({ username: username.value, password: password.value });
    } else if (username.value === "") {
      elementSet("username");
    } else if (password.value === "") {
      elementSet("password");
    } else {
      elementSet("userPass");
    }
  };
  return (
    <div className="flex justify-evenly">
      <div />
      <div className="flex flex-col my-2.5 gap-4 text-center items-center w-[400px]">
        <div>
          Welcome to the App! Enter your username and password, then hit the
          button to begin working!
        </div>
        <LoginRepeatFields loginMethod={handlePageChange} />
      </div>
      <div />
    </div>
  );
};
