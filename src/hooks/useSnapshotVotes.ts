import { useEffect, useState } from "react";
import { getResults } from "hooks/voteSnapshot";
import { Service } from "types/Service";
import { VoteData } from "types/VoteData";

const useSnapshotVotes = () => {
  const [result, setResult] = useState<Service<VoteData>>({
    status: "loading",
  });

  useEffect(() => {
    getResults()
      //      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setResult({ status: "loaded", payload: response });
      })
      .catch((error) => {
        console.log("error: %s", error);
        setResult({ status: "error", error });
      });
  }, []);
  return result;
};

export default useSnapshotVotes;

// (property) ServiceLoaded<VoteData>.payload: VoteData
// Property 'Results' is missing in type
// '{ proposal: any; votingResults:
//   { resultsByVoteBalance: any; resultsByStrategyScore: any; sumOfResultsBalance: any; }; }'
//   but required in type 'VoteData'.ts(2741)
