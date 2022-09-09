import React from "react";
import PageContent from "components/PageContent";
import Chart1 from "components/Chart1";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";

function App() {
  return (
    <div>
      <ThemeProvider>
        <CssBaseline />
        <PageContent />
      </ThemeProvider>
    </div>
  );
}

export default App;
