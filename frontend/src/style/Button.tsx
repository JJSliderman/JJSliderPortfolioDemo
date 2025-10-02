import { Button, styled, ButtonProps } from "@mui/material";
//There is a Props for Buttons, as well as any other style you might need.
//Put all the styles of a specific type in their own files.

export const LinkButtons = styled(Button)<ButtonProps>(() => ({
  textDecoration: "none",
  display: "inline-block",
  paddingRight: "10px",
  color: "#008000",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "inherit",
    color: "#008000",
    cursor: "pointer",
  },
}));
