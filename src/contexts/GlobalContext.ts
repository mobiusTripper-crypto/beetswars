import { createContext, useContext } from "react";

type GlobalContext = {
  bribeFile: string;
  setBribeFile: (c: string) => void;
  gProposal: string;
  setGProposal: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
  showChart: boolean;
  setShowChart: (c: boolean) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  bribeFile: '',
  setBribeFile: () => {},
  gProposal: '',
  setGProposal: () => {},
  gVersion: '',
  setGVersion: () => {},
  showChart: false,
  setShowChart: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);

