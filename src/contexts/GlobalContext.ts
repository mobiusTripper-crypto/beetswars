import { createContext, useContext } from "react";

type GlobalContext = {
  gBribeFile: string;
  setBribeFile: (c: string) => void;
  wantChart: boolean;
  setWantChart: (c: boolean) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  gBribeFile: 'bribe-data-latest.json',
  setBribeFile: () => {},
  wantChart: false,
  setWantChart: () => {}
});

export const useGlobalContext = () => useContext(MyGlobalContext);
 
