import React from "react";
import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
  const { bribeFile, setBribeFile, showChart, setShowChart } =
    useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chartData, setData] = useState([]);
  var chartD = [];
  var rounds = [];
  var tVotes = [];
  var tVoter = [];
  var tBribes = [];
  var tBriber = [];
  var avgPer1000 = [];
  var endTime = [];
  var numRounds = 0;

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
      return "Round " + round.round;
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
    tBriber = chartD.chartdata.map((round: any) => {
      return round.totalBriber;
    });
    avgPer1000 = chartD.chartdata.map(function (round: any) {
      return ((round.totalBribes / round.totalVotes) * 1000).toFixed(2);
    });
    endTime = chartD.chartdata.map(function (round: any) {
      return new Date(parseInt(round.voteEnd) * 1000).toLocaleDateString(
        "en-US"
      );
    });
    numRounds = rounds.length;
  }

  const option = {
    color: ["#F57EFF", "red", "cyan", "yellow", "#56FF00"],
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
      text: "Round 04 - " + (numRounds),
      left: "center",
    },

    tooltip: {
      trigger: "axis",
      padding: 2,
      backgroundColor: "#FFFFFFEE",
      formatter: (args: any) => {
        //console.log(args);
        let tooltip = `<p align='center'><b>${args[0].axisValue} - 
                        ${args[1].axisValue}</b></p>
                          <table> `;

        args.forEach((item: any) => {
          tooltip += `<tr><td>${item.marker}</td><td> ${item.seriesName}:</td><td align='right'> 
            ${(item.value === "0") ? "ukn" : item.value 
            .toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
            }</td></tr>`;
        });
        tooltip += `</table>`;

        return tooltip;
      },
      //formatter: '<b>{b0} - {b1}</b><br/>{a2}: {c2}<br/>{a1}: {c1}<br/>{a0}: {c0}<br/>{a3}: {c3}<br/>{a4}: {c4}'
      //valueFormatter: (value:any) => '$' + value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
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
      link: { xAxisIndex: "all" },
      label: { show: false },
    },

    grid: [
      {
        // Briber 0
        backgroundColor: "#222222DD",
        borderColor: "#222222",
        show: true,
        height: "220",
        left: "15%",
        right: "15%",
        top: "80",
      },
      {
        // avg 1
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "80",
      },
      {
        // Bribes 2
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "80",
      },
      {
        // Voter 3
        backgroundColor: "#222222DD",
        borderColor: "#222222",
        show: true,
        height: "220",
        left: "15%",
        right: "15%",
        top: "370",
      },
      {
        // Votes 4
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "370",
      },
    ],

    xAxis: [
      {
        //briber
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 0,
        show: false,
        triggerEvent: true,
        axisTick: { show: false },
      },
      {
        //avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 1,
        offset: 20,
        show: false,
        triggerEvent: true,
      },
      {
        //bribes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 2,
        show: false,
        triggerEvent: true,
      },
      {
        //voter
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 3,
        show: true,
        triggerEvent: true,
      },
      {
        //votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 4,
        show: true,
        offset: 20,
        triggerEvent: true,
      },
    ],

    yAxis: [
      {
        name: "Total Offers",
        nameTextStyle: { color: "#F57EFF", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 0,
        position: "right",
        offset: 23,
        axisLabel: { color: "#F57EFF", align: "left" },
        axisTick: { show: false },
      },
      {
        name: "avg $/1000",
        nameTextStyle: { color: "red", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 1,
        position: "right",
        axisLabel: { color: "red", align: "left" },
        nameLocation: "start",
      },
      {
        name: "Total Bribes $",
        nameTextStyle: { color: "cyan", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cyan", align: "right" },
        gridIndex: 2,
      },
      {
        name: "Total Voter",
        nameTextStyle: { color: "yellow", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 3,
        axisLabel: { color: "yellow", align: "left" },
        position: "right",
      },
      {
        name: "Total Votes",
        type: "value",
        nameTextStyle: { color: "#56FF00", fontSize: "0.9em" },
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        //  inverse: true,
        gridIndex: 4,
        axisLabel: { color: "#56FF00", align: "right" },
        position: "left",
      },
    ],

    series: [
      {
        name: "Offers",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "#F57EFF", width: 1 },
        data: tBriber,
        xAxisIndex: 0,
        yAxisIndex: 0,
        markPoint: { itemStyle: { color: "#F57EFF" } },
      },
      {
        name: "Avg/1000",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "red", width: 1 },
        data: avgPer1000,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "Bribes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "cyan", width: 2 },
        data: tBribes,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        name: "Voter",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "yellow", width: 1 },
        data: tVoter,
        xAxisIndex: 3,
        yAxisIndex: 3,
      },
      {
        name: "Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "#56FF00" },
        data: tVotes,
        xAxisIndex: 4,
        yAxisIndex: 4,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const offset = 1;

    if ( params.dataIndex > 2 ) {
      let requestedRound = params.dataIndex + offset;
      requestedRound =
        requestedRound < 10 ? "0" + requestedRound : requestedRound;
      setBribeFile("bribe-data-" + requestedRound + ".json");
      setShowChart(false);
    }
    console.log("click", params.dataIndex, "->", bribeFile);
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <>
      <Typography variant="h4" align="center">
        Gauge Vote History
      </Typography>
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: 680 }}
      />
      <Typography variant="body2" align="center">
        (clicking on data points loads historical pages)
      </Typography>

    </>
  );
};

export default Chart1;
