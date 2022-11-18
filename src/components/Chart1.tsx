import React from "react";
import { useRef, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useGlobalContext } from "contexts/GlobalContext";


const Chart1 = React.memo( () => {
  const dataUrl = "https://data.beetswars.live/chart-data.json";
  const {setBribeFile, setShowChart} = useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chData, setData] = useState([]);
  var chartData = [];
  var rounds = [];
  var totalVotes = [];
  var bribedVotes = [];
  var totalVoter = [];
  var totalBribes = [];
  var totalOffers = [];
  var avgPer1000 = [];
  var priceBeets = [];
  var votingApr = [];
  var endTime = [];
  //var numRounds = 0;

  let linewidth = "1";

  const fetchData = async () => {
    const res = await fetch(dataUrl);
    const json = await res.json();
    setData(json);
    setLoaded(true);
  };

  const mountedRef = useRef(true)

  useEffect(() => {
    setLoaded(false);
    fetchData();
    return () => {mountedRef.current = false}
  }, []);

  if (!isLoaded) {
    return <></>;
  } else {
    chartData = JSON.parse(JSON.stringify(chData));
    rounds = chartData.chartdata.map((round: any) => {
      return "Round " + round.round;
    });
    bribedVotes = chartData.chartdata.map((round: any) => {
      return round.bribedVotes;
    });
    totalVotes = chartData.chartdata.map((round: any) => {
      return round.totalVotes;
    });
    totalVoter = chartData.chartdata.map((round: any) => {
      return round.totalVoter;
    });
    totalBribes = chartData.chartdata.map((round: any) => {
      return round.totalBribes;
    });
    totalOffers = chartData.chartdata.map((round: any) => {
      return round.totalBriber;
    });
    avgPer1000 = chartData.chartdata.map((round: any) => {
      return ((round.totalBribes / round.bribedVotes) * 1000).toFixed(2);
    });
    priceBeets = chartData.chartdata.map((round: any) => {
      return parseFloat(round.priceBeets).toFixed(4);
    });
    endTime = chartData.chartdata.map(function (round: any) {
      return new Date(parseInt(round.voteEnd) * 1000).toLocaleDateString(
        "en-US"
      );
    });
    votingApr = chartData.chartdata.map((round: any) => {
      return round.totalBribes/round.priceBeets/round.bribedVotes*1460
    });
    //numRounds = rounds.length;
  }

  const option = {
    color: ["magenta", "cyan", "orange", "red", "white", "yellow", "lime", "green" ],
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
      // text: "Round 04 - " + (numRounds),
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
    },

    axisPointer: {
      link: { xAxisIndex: "all" },
      label: { show: false },
    },

    grid: [
      {
        // Offers index 0  top
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "60",
      },
      {
        // Bribes index 1 top
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "60",
      },
      {
        // avg1000   index 2 middle
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "340",
      },
      {
        // beets price index 3  middle
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "340",
      },
      {
        // voting apr index 4  middle
        show: false,
        height: "220",
        left: "15%",
        right: "15%",
        top: "340",
      },
      {
        // Votes index 5  bottom
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "630",
      },
      {
        // bribed Votes index 6  bottom
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "630",
      },
      {
        // Voter index 7  bottom
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "630",
      },
    ],

    xAxis: [
      {
        // offers
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
        // bribes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 1,
        show: false,
        triggerEvent: true,
      },
      {
        // avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 2,
        offset: 20,
        show: false,
        triggerEvent: true,
      },
      {
        // beets price
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 3,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
      {
        // voting apr
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        //data: rounds,
        gridIndex: 4,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
      {
        // voter
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 5,
        show: true,
        triggerEvent: true,
      },
      {
        // votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 6,
        show: true,
        offset: 20,
        triggerEvent: true,
      },
      {
        // bribed votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        //data: rounds,
        gridIndex: 7,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
    ],

    yAxis: [
      {
        name: "Total Offers",
        nameTextStyle: { color: "magenta", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },  //  #XXXXXX00 invisible
        gridIndex: 0,
        position: "right",
        //offset: 23,
        axisLabel: { color: "magenta", align: "left" },
        axisTick: { show: false },
      },
      {
        name: "Total Bribes $",
        nameTextStyle: { color: "cyan", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cyan", align: "right" },
        gridIndex: 1,
      },
      {
        name: "avg $/1000",
        nameTextStyle: { color: "orange", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        position: "right",
        axisLabel: { color: "orange", align: "left" },
        //nameLocation: "start",
        offset: 43,
      },
      {
        name: "beets price",
        nameTextStyle: { color: "red", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 3,
        position: "left",
        axisLabel: { color: "red", align: "right" },
        //nameLocation: "start",
      },
      {
        name: "voting apr",
        nameTextStyle: { color: "white", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 4,
        position: "right",
        axisLabel: { color: "white", align: "left" },
        nameLocation: "start",
      },
      {
        name: "Total Voter",
        nameTextStyle: { color: "yellow", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 5,
        axisLabel: { color: "yellow", align: "left" },
        position: "right",
      },
      {
        name: "total/bribed Votes",
        type: "value",
        nameTextStyle: { color: "lime", fontSize: "0.9em" },
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        //  inverse: true,
        gridIndex: 6,
        axisLabel: { color: "lime", align: "right" },
        position: "left",
        max: 70000000,
      },
      {
        name: "Bribed Votes",
        nameTextStyle: { color: "green", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 7,
        position: "right",
        axisLabel: { color: "green", align: "left" },
        nameLocation: "start",
        show: false,
        max: 70000000,
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
        lineStyle: { color: "magenta", width: linewidth },
        data: totalOffers,
        xAxisIndex: 0,
        yAxisIndex: 0,
        //markPoint: { itemStyle: { color: "#F57EFF" } },
      },
      {
        name: "Bribes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "cyan", width: linewidth },
        data: totalBribes,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "avg $/1000",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "orange", width: linewidth },
        data: avgPer1000,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        name: "beets price",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "red", width: linewidth },
        data: priceBeets,
        xAxisIndex: 3,
        yAxisIndex: 3,
        //markPoint: { itemStyle: { color: "#15883b" } },
      },
      {
        name: "voting apr",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "white", width: linewidth },
        data: votingApr,
        xAxisIndex: 4,
        yAxisIndex: 4,
        //markPoint: { itemStyle: { color: "#15883b" } },
      },
      {
        name: "Voter",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "yellow", width: linewidth },
        data: totalVoter,
        xAxisIndex: 5,
        yAxisIndex: 5,
      },
      {
        name: "total Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "lime", width: linewidth },
        data: totalVotes,
        xAxisIndex: 6,
        yAxisIndex: 6,
      },
      {
        name: "bribed Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: "0.1" },
        lineStyle: { color: "green", width: 2 },
        data: bribedVotes,
        xAxisIndex: 7,
        yAxisIndex: 7,
        //markPoint: { itemStyle: { color: "#15883b" } },
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
      console.log("click", params.dataIndex, "->", "bribe-data-" + requestedRound + ".json");
    }
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <>
      <Typography variant="h4" align="center" marginBottom="20px">
        Gauge Vote History
      </Typography>
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: 980 }}
      />
      <Typography variant="body2" align="center">
        (clicking on data points loads historical pages)
      </Typography>

    </>
  );
});

export default Chart1;
