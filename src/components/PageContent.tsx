import React, { FC } from "react";

import useBribeDataService from "hooks/useBribeDataService";
import useSnapshotVotes from "hooks/useSnapshotVotes";

const PageContent: FC = () => {
  const service = useBribeDataService();
  const votesData = useSnapshotVotes();

  return (
    <div>
      {(service.status === "loading" || votesData.status === "loading") && (
        <div>Loading...</div>
      )}
      {service.status === "loaded" &&
        votesData.status === "loaded" &&
        service.payload.results.map((bribe, index: number) => (
          <div key={index}>
            <strong>{bribe.poolName}</strong>
            <p>Reward: {bribe.rewardValue}</p>
            <p>
              Votes:
              {(
                (votesData.payload.votingResults.resultsByVoteBalance[
                  bribe.voteIndex
                ] /
                  votesData.payload.votingResults.sumOfResultsBalance) *
                100
              ).toFixed(2)}
              {" %"}
            </p>
            <p>
              $ / fBEETS:{" "}
              {(
                bribe.rewardValue /
                votesData.payload.votingResults.resultsByVoteBalance[
                  bribe.voteIndex
                ]
              ).toFixed(6)}
            </p>
          </div>
        ))}
    </div>
  );
};

export default PageContent;
