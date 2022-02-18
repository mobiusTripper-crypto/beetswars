import React, { FC } from "react";

import useBribeDataService from "hooks/useBribeDataService";
import useSnapshotVotes from "hooks/useSnapshotVotes";
import useGetData from "hooks/useGetData";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

const PageContent: FC = () => {
  // const service = useBribeDataService();
  // const votesData = useSnapshotVotes();

  const getData = useGetData();

  return (
    <div>
      {getData.status === "loading" && <div>Loading...</div>}
      {getData.status === "loaded" &&
        getData.payload.map((data, index: number) => (
          <Card sx={{ maxWidth: 480, margin: 5 }}>
            <CardHeader
              title={data.poolName}
              subheader={"$ / fBEETS: " + data.valuePerVote.toFixed(5)}
            />
            <CardContent>
              <p>
                <strong>Reward: </strong>
                {data.rewardDescription}{" "}
              </p>
              <p>Reward Value: {"$" + data.rewardValue.toFixed(2)}</p>
              <p>
                Percent Above Threshhold:{" "}
                {data.percentAboveThreshold.toFixed(2) + "%"}
              </p>
              <p>Percent Value: {"$" + data.percentValue.toFixed(2)}</p>
              <p>Overall Value: {"$" + data.overallValue.toFixed(2)}</p>
              <p>
                Vote Total:{" "}
                {data.voteTotal + " (" + data.votePercentage.toFixed(2) + "% )"}
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default PageContent;
