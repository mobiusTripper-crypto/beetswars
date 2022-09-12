import React from "react";
import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useGlobalContext } from "contexts/GlobalContext";

/*
//prettier-ignore
const rData = [
  { round: "Round 04", voteEnd: "1645376400", totalVotes: 33021516, totalBribes: 1045420, totalVoter: 2086, },
  { round: "Round 05", voteEnd: "1646586000", totalVotes: 25430796, totalBribes: 580863,  totalVoter: 2000, },
  { round: "Round 06", voteEnd: "1647792000", totalVotes: 36220537, totalBribes: 568172,  totalVoter: 2064, },
  { round: "Round 07", voteEnd: "1649001600", totalVotes: 52744344, totalBribes: 552793,  totalVoter: 2734, },
  { round: "Round 08", voteEnd: "1650211200", totalVotes: 50076576, totalBribes: 589463,  totalVoter: 2244, },
  { round: "Round 09", voteEnd: "1651420800", totalVotes: 48214147, totalBribes: 177810,  totalVoter: 1726, },
  { round: "Round 10", voteEnd: "1652630400", totalVotes: 49594267, totalBribes: 67245,   totalVoter: 1311, },
  { round: "Round 11", voteEnd: "1653840000", totalVotes: 57583594, totalBribes: 54510,   totalVoter: 1317, },
  { round: "Round 12", voteEnd: "1655049600", totalVotes: 50997573, totalBribes: 46990,   totalVoter: 1081, },
  { round: "Round 13", voteEnd: "1657468800", totalVotes: 52804442, totalBribes: 34730,   totalVoter: 998,  },
  { round: "Round 14", voteEnd: "1657468800", totalVotes: 60070860, totalBribes: 32397,   totalVoter: 1020, },
  { round: "Round 15", voteEnd: "1658678400", totalVotes: 58166127, totalBribes: 36891,   totalVoter: 940,  },
  { round: "Round 16", voteEnd: "1659888000", totalVotes: 61494823, totalBribes: 43605,   totalVoter: 1001, },
  { round: "Round 17", voteEnd: "1661097600", totalVotes: 63262198, totalBribes: 32892,   totalVoter: 912,  },
  { round: "Round 18", voteEnd: "1662307200", totalVotes: 62777030, totalBribes: 24516,   totalVoter: 806,  },
];
const rounds = rData.map((round) => {
  return round.round;
});
const tVotes = rData.map(function (round) {
  return round.totalVotes;
});
const tVoters = rData.map(function (round) {
  return round.totalVoter;
});
const tBribes = rData.map(function (round) {
  return round.totalBribes;
});
const avgPer1000 = rData.map(function (round) {
  return ((round.totalBribes / round.totalVotes) * 1000).toFixed(2);
});
const endTime = rData.map(function (round) {
  return new Date(parseInt(round.voteEnd) * 1000).toLocaleDateString("en-US");
});
*/

const Chart1 = () => {

  const dataUrl =
    "https://beetswars-data-git-chartdata-rnz3.vercel.app/chart-data.json";
  const { gBribeFile, setBribeFile, showChart, setShowChart } =
    useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chartData, setData] = useState([]);
  var chartD = [];
  var rounds = [];
  var tVotes = [];
  var tVoter = [];
  var tBribes = [];
  var avgPer1000 = [];
  var endTime = [];
  var numRounds = 0

  const fetchData = async () => {
    const res = await fetch(dataUrl);
    const json = await res.json();
    setData(json);
    setLoaded(true);
  };

  useEffect(() => {
    setLoaded(false);
    fetchData();
  }, []);

  if (!isLoaded) {
    return <></>;
  } else {
    chartD = JSON.parse(JSON.stringify(chartData));
    rounds = chartD.chartdata.map((round: any) => {
      return "R"+round.round;
    });
    tVotes = chartD.chartdata.map(function (round: any) {
      return round.totalVotes;
    });
    tVoter = chartD.chartdata.map(function (round: any) {
      return round.totalVoter;
    });
    tBribes = chartD.chartdata.map(function (round: any) {
      return round.totalBribes;
    });
    avgPer1000 = chartD.chartdata.map(function (round: any) {
      return ((round.totalBribes / round.totalVotes) * 1000).toFixed(2);
    });
    endTime = chartD.chartdata.map(function (round: any) {
      return new Date(parseInt(round.voteEnd) * 1000).toLocaleDateString(
        "en-US"
      );
    });
    numRounds = rounds.length
  }

  const option = {
    textStyle: {
      color: "#ffffff",
    },

    title: {
      textStyle: {
        color: "#ffffff",
      },
      subtextStyle: {
        color: "#fefefe",
      },
      text: "Round 04 - " + (numRounds + 3) ,
      left: "center",
    },

    tooltip: {
      trigger: "axis",
    },
  /*

        legend: {
          data:['Votes','Bribes']
        },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
  */
    axisPointer: {
      //      link: { xAxisIndex: "all", },
      label: { show: true },
    },

    grid: [
      {
        backgroundColor: "#222222",
        borderColor: "#222222",
        show: true,
        height: "220",
        left: "15%",
        right: "15%",
        top: "80",
      },
      {
        backgroundColor: "#222222",
        borderColor: "#222222",
        show: true,
        height: "220",
        left: "15%",
        right: "15%",
        top: "380",
      },
      {
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "380",
      },
      {
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "80",
      },
    ],

    xAxis: [
      {
        //bribes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 0,
        show: true,
        triggerEvent: true,
      },
      {
        //votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 1,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
      {
        //voter
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 2,
        show: false,
        triggerEvent: true,
      },
      {
        //avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 3,
        offset: 20,
        show: true,
        triggerEvent: true,
      },
    ],

    yAxis: [
      {
        name: "Total Bribes $",
nameTextStyle: { color: "blue", fontSize: '1em' },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
      },
      {
        name: "Total Votes",
        type: "value",
nameTextStyle: { color: "green", fontSize: "1em" },
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        //  inverse: true,
        gridIndex: 1,
        position: "left",
      },
      {
        name: "Total Voter",
nameTextStyle: { color: "yellow", fontSize: "1em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 2,
        position: "right",
      },
      {
        name: "avg $/1000",
nameTextStyle: { color: "red", fontSize: "1em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 3,
        position: "right",
      },
    ],

    series: [
      {
        name: "Bribes",
        type: "line",
        symbolSize: 1,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.2" },
        lineStyle: { width: "2" },
        data: tBribes,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: "Votes",
        type: "line",
        symbolSize: 1,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.2" },
        data: tVotes,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "Voter",
        type: "line",
        symbolSize: 1,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.2" },
        data: tVoter,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        name: "Avg/1000",
        type: "line",
        symbolSize: 1,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.2" },
        data: avgPer1000,
        xAxisIndex: 3,
        yAxisIndex: 3,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const offset = 4;
    let requestedRound = params.dataIndex + offset;
    requestedRound =
      requestedRound < 10 ? "0" + requestedRound : requestedRound;
    setBribeFile("bribe-data-" + requestedRound + ".json");
    setShowChart(false);

    console.log("click", params.dataIndex, "->", gBribeFile);
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <>
      <Typography variant="h4" align="center">
        Bribe / Vote History
      </Typography>
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: 740 }}
      />
    </>
  );
};

export default Chart1;
