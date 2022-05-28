import React, { FC } from "react";
import useGetData from "hooks/useGetData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import LabeledListItem from "components/LabeledListItem";
import NavBar from "components/NavBar";
import configData from "config.json";
import { DataGrid, GridRowsProp, GridColDef, GridColTypeDef, GridColumns, GridCellParams} from '@mui/x-data-grid';
import { useState, useEffect } from 'react'


const dec0: GridColTypeDef = {
  type: 'number',
  valueFormatter: ({ value }) => (value).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})
};

const dec2: GridColTypeDef = {
  type: 'number',
  //  valueFormatter: ({ value }) => (value).toFixed(2),
  valueFormatter: ({ value }) => (value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
};

const dpbdec3: GridColTypeDef = {
  type: 'number',
  valueFormatter: ({ value }) => (value * 1000).toFixed(3),
};

const columns: GridColDef[] = [
  { 
    field: 'id', 
    headerName: 'voteindex', 
    flex: 0.3, 
    hide: true 
  },
  { 
    field: 'poolName', 
    headerName: 'Pool', 
    flex: 1.5, 
    renderCell: (cellValues) => {
      return <Link 
               href=
               {cellValues.row.poolUrl} 
               underline="hover" 
               sx={{ fontWeight: '600', fontSize: '1.2rem'}}>
               {cellValues.row.poolName}
             </Link>;
    }
  },
  { 
    field: 'rewardDescription', 
    headerName: 'Description', 
    flex: 3, 
    hide: true  
  },
  { 
    field: 'overallValue', 
    headerName: 'Overall Value', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8, 
    ...dec2 
  },
  { 
    field: 'voteTotal', 
    headerName: 'Vote total', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8, 
    ...dec0 
  },
  { 
    field: 'votePercentage', 
    headerName: '% Vote', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8, 
    ...dec2 
  },
  { 
    field: 'percentAboveThreshold', 
    headerName: '% above', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8,
    hide: true 
  },
  { 
    field: 'valuePerVote', 
    headerName: '$/1000 fBEETs', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8, 
    ...dpbdec3 
  },
];

const PageContent: FC = () => {
  // const service = useBribeDataService();
  // const votesData = useSnapshotVotes();
  const [toggle, setToggle] = useState(true)
  const getData = useGetData();
  var rows: GridRowsProp = []
  var version: string = ''
  var proposal: string = configData.snapshot_hash

  if (getData.status === "loaded") {
    version =  "v" + getData.payload.version
    rows = getData.payload.results
    console.log(getData)
  }

  return (
    <div>
      <NavBar
        version={version}
        proposal={proposal}
      />
      <Typography variant="h4" align="center">
        {configData.page_header}
      </Typography>
      <Typography variant="h2" fontWeight="700" align="center">
        <Box sx={{ display: "inline", color: "#4BE39C" }}>BEETS WARS</Box>
        {" - "}
        <Box sx={{ display: "inline", color: "#ED1200" }}>ROI Dashboard</Box>
      </Typography>
      <Typography variant="body2" align="center">
        This website is still in BETA. This is 3rd party service independent of
        BeethovenX and please do your own research. This is not investment
        advice!
      </Typography>

      {getData.status === "loading" && <div>Loading...</div>}
      {getData.status === "loaded" && (

        <div>
          <Typography variant="h4" align="center">
            {"Total Votes: " +
              getData.payload.totalVotes.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) +
              " Total Bribes - $" +
              getData.payload.totalBribeAmount.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
          </Typography>
          <div style={{display: 'flex', marginRight: '9px', justifyContent: "flex-end"}}>
            <button onClick={() => setToggle(!toggle)}>
              {toggle ? ( <small> Table </small>):( <small> Cards </small>)}
            </button>
          </div>

          {toggle ? (

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              px: 1,
            }}
          >
            {getData.payload.results.map((data, index: number) => (
              <Box
                key={index}
                sx={{
                  flex: {
                    lg: "0 1 calc(25% - 1em)",
                    md: "0 1 calc(33% - 1em)",
                    sm: "0 1 calc(50% - 1em)",
                    xs: "0 1 100%",
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
                      <Link
                        href={data.poolUrl}
                        underline="hover"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.poolName}
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </span>
                      </Link>
                    </Typography>
                    {data.isQualified ? (
                      <div>
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
                      </div>
                    ) : (
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        align="center"
                      >
                        below .15% votes
                      </Typography>
                    )}
                    <Typography color="text.secondary" variant="body2">
                      <strong>Reward: </strong>
                      {data.rewardDescription}
                    </Typography>
                    {data.assumption && (
                      <Typography color="text.secondary" variant="body2">
                        <strong>Assumptions: </strong>
                        {data.assumption}
                      </Typography>
                    )}
                    {data.additionalrewards && (
                      data.additionalrewards.map(item => (
                       <Box>
                        <Typography style={{display: 'inline-block'}} color="text.secondary" variant="body2">
                          <strong>Tier {item.tier}: </strong>
                        </Typography>
                        <Typography style={{display: 'inline-block', float: 'inline-end'}} color="#4BE39C">
                          {"$" + (data.valuePerVote * 1000 * item.factor).toFixed(2)}
                        </Typography>
                       </Box>
                      ))
                    )}
                  </Box>
                  <Divider variant="middle" />
                  <Box sx={{ m: 1 }}>
                    <List dense={true}>
                      {data.rewardValue > 0 && (
                        <LabeledListItem
                          label="Fixed Reward Amount"
                          value={
                            "$" +
                            data.rewardValue.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                          }
                        />
                      )}
                      {data.ispercentage && (
                        <div>
                          {/* <LabeledListItem
                            label="Percent Above Threshhold"
                            value={data.percentAboveThreshold.toFixed(2) + "%"}
                          /> */}
                          <LabeledListItem
                            label="Percent Amount"
                            value={
                              "$" +
                              data.percentValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            }
                          />{" "}
                        </div>
                      )}
                      {data.ispercentage && data.rewardValue > 0 && (
                        <LabeledListItem
                          label="Overall Amount"
                          value={
                            "$" +
                            data.overallValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          }
                        />
                      )}
                      <LabeledListItem
                        label="Vote Total"
                        value={
                          data.votePercentage.toFixed(2) +
                          "% - [ " +
                          data.voteTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }) +
                          " ]"
                        }
                      />

                      <LabeledListItem
                        label="$ / fBEETS"
                        value={data.valuePerVote.toFixed(7)}
                      />
                    </List>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          ) : (

          <Box sx={{ 
            display: 'flex',  
            margin: '7px', 
            '& .underthreshold': {
              color: '#FF0000FF',
            },
            '& .cell-mono': {
              fontFamily: 'monospace',
            },
          }}>
            <DataGrid
              sx={{
                width: "100%",
                bgcolor: "rgba(12,12,12)",
                borderRadius: 1,
                fontSize: "1rem",
                '.MuiDataGrid-columnHeaders': {
                  fontWeight: "700",
                  fontSize: "1rem",
                },
              }}
              sortingOrder={['desc', 'asc']}
              rows={rows}
              columns={columns}
              autoHeight={true}
              hideFooter={true}
              getCellClassName={(params: GridCellParams<number>) => {
                if (params.field === 'votePercentage' && params.value <= 0.15 ) {
                  return 'underthreshold';
                }
                return '';
              }}
            />
          </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default PageContent;

