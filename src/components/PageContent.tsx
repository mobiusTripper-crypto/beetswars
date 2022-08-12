import React, { FC } from "react";
import useGetData from "hooks/useGetData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import LabeledListItem from "components/LabeledListItem";
import NavBar from "components/NavBar";
import { DataGrid, GridRowsProp, GridColDef, GridColTypeDef, GridCellParams} from '@mui/x-data-grid';
import { useState } from 'react'
import TimeFormatter from "utils/TimeFormatter"
import { BribeFiles } from "types/Dashboard";
import MyBackdrop from 'components/MyBackdrop';

const PageContent: FC = () => {

  const [bribeFile, changeBribeFile] = useState('bribe-data-latest.json')
  const [tableCards, changeTableCards] = useState(true)
  const [oldproposal, setOldproposal] = useState("nix")
  const getData = useGetData(bribeFile);
  var rows: GridRowsProp = []
  var version: string = ''
  var voteStart: number = 0
  var voteEnd: number = 0
  var voteTitle: string = ''
  var voteState: string = ''
  var proposal: string = ""
  var voteActive: boolean = false
  var bribeFiles: BribeFiles[] = []

  if (getData.status === "loaded") {
    version =  "v" + getData.payload.version
    rows = getData.payload.results
    voteStart = getData.payload.proposalStart
    voteEnd = getData.payload.proposalEnd
    voteTitle = getData.payload.proposalTitle
    proposal = getData.payload.proposalId
    voteState = getData.payload.proposalState
    bribeFiles = getData.payload.bribeFiles
    //console.log(getData)
  }

  // debug timestamps
  // voteStart = 1654690000
  // voteEnd =   1656082854

  const tsNow = Math.floor(Date.now() / 1000)
  const dateStart = new Date(voteStart*1000).toUTCString()
  const dateEnd = new Date(voteEnd*1000).toUTCString()
  const timeTogo:string = TimeFormatter((voteEnd - tsNow))

  voteActive = (voteState === "active" ) ? true : false

  const roundNumber = /[0-9]a*/g
  const bribeFilesRev: BribeFiles[] = JSON.parse(JSON.stringify(bribeFiles)).reverse()

  const handleChange = (e:any) => {
    console.log(e.target.value);
    setOldproposal(proposal)
    changeBribeFile(e.target.value);
  };

  return (
    <div>
      <NavBar
        version={version}
        proposal={proposal}
      />
      <Typography variant="h2" fontWeight="700" align="center">
        <Box sx={{ display: "inline", color: "#4BE39C" }}>BEETS WARS</Box>
        {" - "}
        <Box sx={{ display: "inline", color: "#ED1200" }}>ROI Dashboard</Box>
      </Typography>

      {getData.status === "loading" && <Typography variant="h4" align="center">Loading...</Typography>}
      {getData.status === "loaded" && (

        <div>
      <Typography variant="h4" align="center">
        {voteTitle}
      </Typography>
      <Typography variant="body2" align="center">
         Vote Start: {dateStart} - Vote End: {dateEnd} - ({voteActive ? timeTogo + " to go" : voteState})
      </Typography>
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
          <Box sx={{  padding: "2px", display: 'flex', justifyContent: 'flex-end', marginTop: "10px" }}> 
            <div style={{ marginRight: '9px'}}>
              <select onChange={handleChange} value={bribeFile}>
                {bribeFilesRev.map((bf:any,index:number) =>
                  <option key={index} value={bf.filename}>Round {bf.filename.match(new RegExp(roundNumber)) }</option>
                )}
              </select>
          </div>
          <div style={{ marginRight: '9px'}}>
            <button onClick={() => changeTableCards(!tableCards)}>
              {tableCards ? ("Table"):("Cards")}
            </button>
          </div>
        </Box>

          {tableCards ? (

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
                        below .15% votes or under threshold
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
                      data.additionalrewards.map((item, index:number) => (
                       <Box key={index}>
                        <Typography style={{display: 'inline-block'}} color="text.secondary" variant="body2">
                          <strong>Tier {item.tier}: </strong>
                        </Typography>
                        <Typography style={{display: 'inline-block', float: 'right'}} color="#4BE39C">
                          {"$" + (data.valuePerVote * 1000 * item.factor).toFixed(2)}
                        </Typography>
                       </Box>
                      ))
                    )}
                  </Box>
                  <Divider variant="middle" />
                  <Box sx={{ m: 1 }}>
                    <List dense={true}>
                        <LabeledListItem
                          label = {data.LabelValue.label}
                          value={
                            "$" +
                            data.LabelValue.value.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                          }
                        />
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
               // if (params.field === 'votePercentage' && params.value <== 0.15 ) {
               //   return 'underthreshold';
               // }
                return '';
              }}
            />
          </Box>
          )}
        </div>
      )}
      <Typography variant="body2" align="center">
        This website is still in BETA. This is 3rd party service independent of
        BeethovenX and please do your own research. This is not investment
        advice!
      </Typography>
      {proposal === oldproposal && <MyBackdrop/>}
    </div>
  );
};

export default PageContent;


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
    field: 'titlevalue', 
    headerName: 'Total Value', 
    type: 'number', 
    cellClassName: 'cell-mono',
    flex: 0.8, 
    renderCell: (cellValues) => {
        return cellValues.row.titlevalue.value
          .toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    },
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

