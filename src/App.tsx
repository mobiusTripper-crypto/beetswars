import React from "react";
import PageContent from "components/PageContent2";
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
    </div>
  );
}

export default App;
