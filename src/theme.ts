import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true, // Prevents background from freezing
      },
      styleOverrides: {
        paper: {
          maxHeight: 320,
          overflowY: "auto",
        },
      },
    },
  },
});
