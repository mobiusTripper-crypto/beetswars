import React, { FC, useState, createContext, useContext } from "react";
import {
  ThemeOptions,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

// declare module "@mui/material/styles" {
//   interface BreakpointOverrides {
//     xs: false;
//     sm: false;
//     md: false;
//     lg: false;
//     xl: false;
//     mobile: true;
//     tablet: true;
//     laptop: true;
//     desktop: true;
//   }
// }

type ThemeProviderType = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const initialState: ThemeProviderType = {
  toggleTheme: () => {},
  isDarkMode: true,
};

const ThemeContext = createContext<ThemeProviderType>(initialState);

export const useTheme: () => ThemeProviderType = () => useContext(ThemeContext);

const baseThemeOptions: ThemeOptions = {
  spacing: 8,
  palette: {
    secondary: {
      main: "#673ab7",
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 900,
    button: {
      fontWeight: 600,
    },
  },
  // breakpoints: {
  //   values: {
  //     mobile: 0,
  //     tablet: 640,
  //     laptop: 1024,
  //     desktop: 1200,
  //   },
  //},
};

const lightThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#4c9872",
      contrastText: "#DDD",
    },
    mode: "light",
    background: {
      paper: "#EEE",
      default: "#EEE",
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#7CC9A1",
    },
    mode: "dark",
    background: {
      default: "#141F63",
    },
  },
};

let lightTheme = createTheme(deepmerge(baseThemeOptions, lightThemeOptions));
let darkTheme = createTheme(deepmerge(baseThemeOptions, darkThemeOptions));

lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

const ThemeProvider: FC = ({ children }) => {
  const [isDarkMode, toggleTheme1] = useState(true);
  const appliedTheme = isDarkMode ? darkTheme : lightTheme;

  function toggleTheme() {
    toggleTheme1(!isDarkMode);
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <MuiThemeProvider theme={appliedTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
