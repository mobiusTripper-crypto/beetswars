import React, { FC } from "react";

import useGetData from "hooks/useGetData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

const PageContent: FC = () => {
  // const service = useBribeDataService();
  // const votesData = useSnapshotVotes();

  const getData = useGetData();

  return (
    <div>
      <Typography variant="h2" fontWeight="700" align="center">
        <Box sx={{ display: "inline", color: "#4BE39C" }}>BEETS WARS</Box>
        {" - "}
        <Box sx={{ display: "inline", color: "#ED1200" }}>ROI Dashboard</Box>
      </Typography>
      <Typography variant="body1" align="center">
        This website is in BETA TESTING. This is 3rd party service independent
        of BeethovenX and please do your own research. This is not investment
        advice.
      </Typography>

      {getData.status === "loading" && <div>Loading...</div>}
      {getData.status === "loaded" && (
        <div>
          <Typography variant="h4" align="center">
            Total Votes:{" "}
            {getData.payload.totalVotes.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              px: 1,
            }}
          >
            {getData.payload.results.map((data, index: number) => (
              <Box
                key={index}
                sx={{
                  flex: {
                    xl: "0 1 calc(25% - 1em)",
                    lg: "0 1 calc(33% - 1em)",
                    md: "0 1 calc(50% - 1em)",
                    sm: "0 1 100%",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 4,
                  }}
                >
                  <Box sx={{ my: 3, mx: 2, pt: 1 }}>
                    <Typography gutterBottom variant="h4" component="div">
                      <Link href={data.poolUrl} underline="hover">
                        {data.poolName}
                      </Link>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      align="center"
                    >
                      Voting with 1000 fBEETS returns
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      align="center"
                      sx={{ color: "#4BE39C" }}
                    >
                      {"$" + (data.valuePerVote * 1000).toFixed(2)}
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                      <strong>Reward: </strong>
                      {data.rewardDescription}{" "}
                    </Typography>
                  </Box>
                  <Divider variant="middle" />
                  <Box sx={{ m: 1 }}>
                    <List dense={true}>
                      <ListItem>
                        {"Reward Amount: $" +
                          data.rewardValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </ListItem>
                      <ListItem>
                        {"Percent Above Threshhold: " +
                          data.percentAboveThreshold.toFixed(2) +
                          "%"}
                      </ListItem>
                      <ListItem>
                        {"Percent Amount: $" +
                          data.percentValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </ListItem>

                      <ListItem>
                        {"Overall Amount: $" +
                          data.overallValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </ListItem>
                      <ListItem>
                        {"Vote Total: " +
                          data.voteTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }) +
                          " (" +
                          data.votePercentage.toFixed(2) +
                          "% )"}
                      </ListItem>
                      <ListItem>
                        $ / fBEETS: {data.valuePerVote.toFixed(7)}
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      )}
    </div>
  );
};

export default PageContent;
