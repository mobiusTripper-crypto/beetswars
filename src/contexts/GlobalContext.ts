import { createContext, useContext } from "react";

type GlobalContext = {
  gBribeFile: string;
  setBribeFile: (c: string) => void;
  showChart: boolean;
  setShowChart: (c: boolean) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  gBribeFile: 'bribe-data-latest.json',
  setBribeFile: () => {},
  showChart: false,
  setShowChart: () => {}
});

export const useGlobalContext = () => useContext(MyGlobalContext);
 
