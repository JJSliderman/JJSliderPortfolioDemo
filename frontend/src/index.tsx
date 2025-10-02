import { Container, createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline, AlertColor } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { createContext, ReactElement, useContext, useState } from "react";
import { theme } from "./utils/Theme";
import { MangaAlert } from "./components/MangaAlert";

export type AlertType = {
  message: string;
  severity?: AlertColor;
  open: boolean;
};

type AlerterType = {
  showAlert: (value: AlertType) => void;
  hideAlert: () => void;
  alert: AlertType;
};

export const handleShowAlertContext = createContext<AlerterType>({
  showAlert: () => {
    /* empty function */
  },
  hideAlert: () => {
    /* empty function */
  },
  alert: { message: "", severity: "info", open: false },
});

type AlertProvideType = {
  children: ReactElement;
};

export const AlertProvider = ({ children }: AlertProvideType) => {
  const [alert, setAlert] = useState<AlertType>({
    message: "",
    severity: "info",
    open: false,
  });

  const showAlert = (value: AlertType) => {
    setAlert(value);
  };

  const hideAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <handleShowAlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </handleShowAlertContext.Provider>
  );
};

type AuthContextType = {
  access: string;
  setAccess: (access: string) => void;
  refresh: string;
  setRefresh: (refresh: string) => void;
  loggedInUser: string;
  setLoggedInUser: (loggedInUser: string) => void;
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  access: "",
  setAccess: () => {
    /* empty function */
  },
  refresh: "",
  setRefresh: () => {
    /* empty function */
  },
  loggedInUser: "",
  setLoggedInUser: () => {
    /* empty function */
  },
});

// AuthProvider component
interface AuthProviderProps {
  children: ReactElement;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [access, setAccess] = useState<string>("");
  const [refresh, setRefresh] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        access,
        setAccess,
        refresh,
        setRefresh,
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAlert = () => useContext(handleShowAlertContext);

const Main = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AlertProvider>
          <BrowserRouter>
            <CssBaseline />
            <App />
            <MangaAlert />
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
const domNode = document.querySelector("#root");
const root = createRoot(domNode as Container);
root.render(<Main />);
