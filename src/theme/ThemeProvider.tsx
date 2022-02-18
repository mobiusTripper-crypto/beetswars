import React, { FC, useState, createContext, useContext } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
//import theme from './theme'

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

const lightTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "light",
    primary: {
      main: "#7CC9A1",
    },
    secondary: {
      main: "#673ab7",
    },
  },
  typography: {
    button: {
      fontWeight: 600,
    },
  },
});

const darkTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: "#7CC9A1",
    },
    secondary: {
      main: "#673ab7",
    },
  },
  typography: {
    button: {
      fontWeight: 600,
    },
  },
});

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
