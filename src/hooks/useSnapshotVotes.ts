import { useEffect, useState } from "react";
import { getResults } from "hooks/voteSnapshot";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";

const useSnapshotVotes = () => {
  const [result, setResult] = useState<ServiceType<VoteDataType>>({
    status: "loading",
  });

  useEffect(() => {
    console.log("snapshot vote fetch");
    getResults()
      //      .then((response) => response.json())
      .then((response) => {
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
