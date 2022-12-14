import { createContext, useContext } from "react";

type GlobalContext = {
  requestedRound: string;
  requestRound: (c: string) => void;
  gProposal: string;
  setGProposal: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
  showChart: boolean;
  setShowChart: (c: boolean) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  requestedRound: '',
  requestRound: () => {},
  gProposal: '',
  setGProposal: () => {},
  gVersion: '',
  setGVersion: () => {},
  showChart: false,
  setShowChart: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);

