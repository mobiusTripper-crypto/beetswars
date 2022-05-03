import React from "react";
import PageContent from "components/PageContent";
import NavBar from "components/NavBar";
import EmptyDiv from "components/EmptyDiv";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";
import { RefreshContextProvider } from "contexts/RefreshContext";

function App() {
  return (
    <div>
      <ThemeProvider>
        <CssBaseline />
        <RefreshContextProvider>
          <PageContent />
        </RefreshContextProvider>
      </ThemeProvider>
      <EmptyDiv />
    </div>
  );
}

export default App;
