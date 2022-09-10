import React, { useState } from "react";
import PageContent from "components/PageContent";
import Chart1 from "components/Chart1";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";
import { MyGlobalContext } from "contexts/GlobalContext";



function App() {

  const [gBribeFile, setBribeFile] = useState<string>("bribe-data-latest.json");
  const [wantChart, setWantChart] = useState<boolean>(false);

  return (
      <MyGlobalContext.Provider value={{ gBribeFile, setBribeFile, wantChart, setWantChart }}>
    <div>
      <ThemeProvider>
        <CssBaseline />

        <PageContent />

      </ThemeProvider>
    </div>
      </MyGlobalContext.Provider>
  );
}

export default App;
