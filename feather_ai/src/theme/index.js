import { createTheme } from "@mui/material/styles";

const customTheme = (primaryColor) => {
  return createTheme({
    typography: {
      fontFamily: "Raleway",
    },
    palette: {
      primary: {
        main: primaryColor,
      },
    },
  });
};

export default customTheme;
