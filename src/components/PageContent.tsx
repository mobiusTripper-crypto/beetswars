import React, { FC } from "react";

import useBribeDataService from "hooks/useBribeDataService";
import useSnapshotVotes from "hooks/useSnapshotVotes";
import useGetData from "hooks/useGetData";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

const PageContent: FC = () => {
  // const service = useBribeDataService();
  // const votesData = useSnapshotVotes();

  const getData = useGetData();

  return (
    <div>
      <Box>BEETS WARS ROI Dashboard</Box>

      {getData.status === "loading" && <div>Loading...</div>}
      {getData.status === "loaded" && (
        <div>
          Total Votes:{" "}
          {getData.payload.totalVotes.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              px: 5,
            }}
          >
            {getData.payload.results.map((data, index: number) => (
              <Box
                key={index}
                sx={{
                  flex: {
                    lg: "0 1 calc(33% - 1em)",
                    md: "0 1 calc(50% - 1em)",
                    sm: "0 1 100%",
                  },
                }}
              >
                <Card sx={{ margin: 5 }} key={index}>
                  <CardHeader
                    title={data.poolName}
                    subheader={"$ / fBEETS: " + data.valuePerVote.toFixed(5)}
                  />
                  <CardContent>
                    <p>
                      <strong>Reward: </strong>
                      {data.rewardDescription}{" "}
                    </p>
                    <p>
                      Reward Value:{" "}
                      {"$" +
                        data.rewardValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </p>
                    <p>
                      Percent Above Threshhold:{" "}
                      {data.percentAboveThreshold.toFixed(2) + "%"}
                    </p>
                    <p>
                      Percent Value:{" "}
                      {"$" +
                        data.percentValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </p>
                    <p>
                      Overall Value:{" "}
                      {"$" +
                        data.overallValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </p>
                    <p>
                      Vote Total:{" "}
                      {data.voteTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) +
                        " (" +
                        data.votePercentage.toFixed(2) +
                        "% )"}
                    </p>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </div>
      )}
    </div>
  );
};

export default PageContent;
