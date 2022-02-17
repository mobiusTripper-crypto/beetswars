import React, { FC } from "react";

import useBribeDataService from "hooks/useBribeDataService";
import useSnapshotVotes from "hooks/useSnapshotVotes";

const PageContent: FC = () => {
  const service = useBribeDataService();
  const votesData = useSnapshotVotes();

  const borderStyle = {
    borderColor: "black",
    borderWidth: "10px",
    padding: "1.5em",
    borderStyle: "solid",
  };

  return (
    <div>
      {(service.status === "loading" || votesData.status === "loading") && (
        <div>Loading...</div>
      )}
      {service.status === "loaded" &&
        votesData.status === "loaded" &&
        service.payload.results.map((bribe, index: number) => (
          <div style={borderStyle} key={index}>
            <strong>{bribe.poolname}</strong>
            {votesData.payload.proposal.choices[bribe.voteindex]}
            <p>Reward: {bribe.rewarddescription}</p>
            <p>
              <span>Votes:</span>
              <span>
                {votesData.payload.votingResults.resultsByVoteBalance[
                  bribe.voteindex
                ].toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>{" "}
              {" - "}
              <span>
                {(
                  (votesData.payload.votingResults.resultsByVoteBalance[
                    bribe.voteindex
                  ] /
                    votesData.payload.votingResults.sumOfResultsBalance) *
                  100
                ).toFixed(2)}
                {" %"}
              </span>
            </p>
            <p>
              $ / fBEETS:{" "}
              {(
                bribe.rewardamount /
                votesData.payload.votingResults.resultsByVoteBalance[
                  bribe.voteindex
                ]
              ).toFixed(8)}
            </p>
          </div>
        ))}
    </div>
  );
};

export default PageContent;
