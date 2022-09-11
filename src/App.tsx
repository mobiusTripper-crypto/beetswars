import React, { useState } from "react";
import PageContent from "components/PageContent";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";
import { MyGlobalContext } from "contexts/GlobalContext";



function App() {

  const [gBribeFile, setBribeFile] = useState<string>("bribe-data-latest.json");
  const [showChart, setShowChart] = useState<boolean>(true);

  return (
    <div>
        <MyGlobalContext.Provider value={{ gBribeFile, setBribeFile, showChart, setShowChart }}>
      <ThemeProvider>
        <CssBaseline />
          <PageContent />
      </ThemeProvider>
        </MyGlobalContext.Provider>
    </div>
  );
}

export default App;
