import { Box, BoxProps, styled } from "@mui/material";
//There is a Props for Buttons, as well as any other style you might need.
//Put all the styles of a specific type in their own files.
import { theme } from "../utils/Theme";

export const MainBox = styled(Box)<BoxProps>(() => ({
  backgroundColor: theme.palette.primary.main,
}));

export const LogoBox = styled(Box)<BoxProps>(() => ({
  img: {
    width: "200px",
  },
}));

export default MainBox;
