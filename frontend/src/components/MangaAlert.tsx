import { Alert, Snackbar } from "@mui/material";
import { useAlert } from "..";

export const MangaAlert = () => {
  const { alert, hideAlert } = useAlert();

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={2000}
      onClose={hideAlert}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={alert.severity} variant="filled">
        {alert.message}
      </Alert>
    </Snackbar>
  );
};
