import React from "react";
import ReactECharts from "echarts-for-react";

const rData = [
  {
    round: "Round 04",
    totalVotes: 33021516,
    totalBribes: 1045420,
    totalVoters: 2086,
  },
  {
    round: "Round 05",
    totalVotes: 25430796,
    totalBribes: 580863,
    totalVoters: 2000,
  },
  {
    round: "Round 06",
    totalVotes: 36220537,
    totalBribes: 568172,
    totalVoters: 2064,
  },
  {
    round: "Round 07",
    totalVotes: 52744344,
    totalBribes: 552793,
    totalVoters: 2734,
  },
  {
    round: "Round 08",
    totalVotes: 50076576,
    totalBribes: 589463,
    totalVoters: 2244,
  },
  {
    round: "Round 09",
    totalVotes: 48214147,
    totalBribes: 177810,
    totalVoters: 1726,
  },
  {
    round: "Round 10",
    totalVotes: 49594267,
    totalBribes: 67245,
    totalVoters: 1311,
  },
  {
    round: "Round 11",
    totalVotes: 57583594,
    totalBribes: 54510,
    totalVoters: 1317,
  },
  {
    round: "Round 12",
    totalVotes: 50997573,
    totalBribes: 46990,
    totalVoters: 1081,
  },
  {
    round: "Round 13",
    totalVotes: 52804442,
    totalBribes: 34730,
    totalVoters: 998,
  },
  {
    round: "Round 14",
    totalVotes: 60070860,
    totalBribes: 32397,
    totalVoters: 1020,
  },
  {
    round: "Round 15",
    totalVotes: 58166127,
    totalBribes: 36891,
    totalVoters: 940,
  },
  {
    round: "Round 16",
    totalVotes: 61494823,
    totalBribes: 43605,
    totalVoters: 1001,
  },
  {
    round: "Round 17",
    totalVotes: 63262198,
    totalBribes: 32892,
    totalVoters: 912,
  },
  {
    round: "Round 18",
    totalVotes: 62777030,
    totalBribes: 24516,
    totalVoters: 806,
  },
];

const rounds = rData.map(function (round) {
  return round.round;
});
const tVotes = rData.map(function (round) {
  return round.totalVotes;
});
const tVoters = rData.map(function (round) {
  return round.totalVoters;
});
const tBribes = rData.map(function (round) {
  return round.totalBribes;
});
const avgPer1000 = rData.map(function (round) {
  return round.totalBribes / round.totalVotes * 1000 ;
});

console.log(avgPer1000)

const Chart1: React.FC = () => {
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
      text: "Total Bribes / Votes / Voter",
      subtext: "Round 04 - 18",
      left: "center",
    },

    tooltip: {
      trigger: "axis",
    },

    //    legend: {
    //      data:['Votes','Bribes']
    //    },

    //  toolbox: {
    //    feature: {
    //      dataZoom: {
    //        yAxisIndex: 'none'
    //      },
    //      restore: {},
    //      saveAsImage: {}
    //    }
    //  },

    axisPointer: {
//      link: { xAxisIndex: "all", },
      label: { show: false },
    },

    grid: [
      {
show: false,
        height: "220",
        left: "200",
        right: "200",
        top: "80",
      },
      {
show: false,
        height: "220",
        left: "200",
        right: "200",
        top: "350",
      },
      {
show: false,
        height: "70",
        left: "200",
        right: "200",
        top: "500",
      },
      {
show: false,
        height: "220",
        left: "200",
        right: "200",
        top: "80",
      },
    ],

    xAxis: [
      { //bribes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 0,
        show: false,
      },
      { //votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 1,
        show: false,
      },
      { //voter
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 2,
        show: true,
      },
      { //avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 3,
        show: false,
      },
    ],

    yAxis: [
      {
        name: 'Total Bribes $',
        type: "value",
        splitLine: { lineStyle: { type: 'dotted', color: '#999999', } },
      },
      {
        name: 'Total Votes',
        type: "value",
        splitLine: { lineStyle: { type: 'dotted', color: '#999999', } },
        //  inverse: true,
        gridIndex: 1,
        position: "left",
      },
      {
        name: 'Total Voter',
        type: "value",
        splitLine: { lineStyle: { type: 'dotted', color: '#999999', } },
        gridIndex: 2,
        position: "right",
      },
      {
        name: 'avg $/1000',
        type: "value",
        splitLine: { lineStyle: { type: 'dotted', color: '#999999', } },
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
        areaStyle: { opacity: '0.4' },
        lineStyle: { width: '2' },
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
        areaStyle: { opacity: '0.4' },
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
        areaStyle: { opacity: '0.4' },
        data: tVoters,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        name: "Avg/1000",
        type: "line",
symbolSize: 1,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: '0.4' },
        data: avgPer1000,
        xAxisIndex: 3,
        yAxisIndex: 3,
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: 800 }} />
  );
};

export default Chart1;
