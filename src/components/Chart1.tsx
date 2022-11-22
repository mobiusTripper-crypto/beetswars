import React from "react";
import { useRef, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useGlobalContext } from "contexts/GlobalContext";

const Chart1 = React.memo(() => {
  const dataUrl = "https://data.beetswars.live/chart-data.json";
  const { setBribeFile, setShowChart } = useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chData, setData] = useState([]);
  var chartData = [];
  var rounds = [];
  var totalVotes = [];
  var bribedVotes = [];
  var bribedVotesRatio = [];
  var totalVoter = [];
  var totalBribes = [];
  var totalOffers = [];
  var avgPer1000 = [];
  var priceBeets = [];
  var priceFbeets = [];
  var votingApr = [];
  var endTime = [];
  //var numRounds = 0;

  let linewidth = "2";
  let opacity = "0.04";
  let areastyle = { opacity: opacity };

  const fetchData = async () => {
    const res = await fetch(dataUrl);
    const json = await res.json();
    setData(json);
    setLoaded(true);
  };

  const mountedRef = useRef(true);

  useEffect(() => {
    setLoaded(false);
    fetchData();
    return () => {
      mountedRef.current = false;
    };
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
    bribedVotesRatio = chartData.chartdata.map((round: any) => {
      return ((round.bribedVotes / round.totalVotes) * 100).toFixed(2);
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
    priceFbeets = chartData.chartdata.map((round: any) => {
      return round.priceFbeets;
    });
    endTime = chartData.chartdata.map(function (round: any) {
      return new Date(parseInt(round.voteEnd) * 1000).toLocaleDateString(
        "en-US"
      );
    });
    votingApr = chartData.chartdata.map((round: any) => {
      return (round.totalBribes / round.priceFbeets / round.bribedVotes) * 2600;
    });
    //numRounds = rounds.length;
  }

  const option = {
    color: [
      "magenta",
      "cyan",
      "orange",
      "red",
      "white",
      "yellow",
      "lime",
      "green",
      "grey",
    ],
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
      padding: 7,
      backgroundColor: "#FFFFFFEE",
      formatter: (args: any) => {
        //console.log(args);
        let tooltip = `<p align='center'><b>${args[0].axisValue} - 
                        ${args[1].axisValue}</b></p>
                          <table> `;

        args.forEach((item: any) => {
          tooltip += `<tr><td>${item.marker}</td><td> ${
            item.seriesName
          }:</td><td align='right'> 
            ${
              item.value === "0"
                ? "0"
                : item.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
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
        // index 0  top
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        // top: "60",
      },
      {
        // index 1 middle
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "360",
      },
      {
        // index 2  bottom
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "680",
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
        gridIndex: 0,
        show: false,
        triggerEvent: true,
      },
      {
        // avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: rounds,
        gridIndex: 1,
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
        gridIndex: 1,
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
        gridIndex: 1,
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
        gridIndex: 2,
        show: true,
        offset: 10,
        position: "bottom",
        triggerEvent: true,
      },
      {
        // votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 2,
        show: true,
        offset: 30,
        position: "bottom",
        triggerEvent: true,
      },
      {
        // bribed votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 2,
        show: false,
        offset: 30,
        triggerEvent: true,
      },
      {
        // bribed ratio
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        data: endTime,
        gridIndex: 2,
        show: false,
        //offset: 20,
        triggerEvent: true,
      },
    ],

    yAxis: [
      {
        name: "Offers",
        nameTextStyle: { color: "magenta", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } }, //  #XXXXXX00 invisible
        gridIndex: 0,
        position: "right",
        axisLabel: { color: "magenta", align: "left" },
        axisTick: { show: false },
      },
      {
        name: "Total Incentives $",
        nameTextStyle: { color: "cyan", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cyan", align: "right" },
        gridIndex: 0,
      },
      {
        name: "Avg $/1000 fB",
        nameTextStyle: { color: "orange", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 1,
        position: "right",
        axisLabel: { color: "orange", align: "left" },
        offset: 43,
      },
      {
        name: "Beets Price $",
        nameTextStyle: { color: "red", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 1,
        position: "left",
        axisLabel: { color: "red", align: "right" },
      },
      {
        name: "Voting APR %",
        nameTextStyle: { color: "white", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 1,
        position: "right",
        axisLabel: { color: "white", align: "left" },
        nameLocation: "start",
      },
      {
        name: "Total Voter",
        nameTextStyle: { color: "yellow", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        axisLabel: { color: "yellow", align: "left" },
        position: "right",
      },
      {
        name: "Total Votes - Incentivised Votes",
        type: "value",
        nameTextStyle: { color: "lime", fontSize: "0.9em" },
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 2,
        axisLabel: { color: "lime", align: "right" },
        position: "left",
        max: 70000000,
      },
      {
        name: "Incentivised Votes",
        nameTextStyle: { color: "green", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        position: "right",
        axisLabel: { color: "green", align: "left" },
        nameLocation: "start",
        show: false,
        max: 70000000,
      },
      {
        name: "Incentivised Votes Ratio",
        nameTextStyle: { color: "grey", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        position: "right",
        axisLabel: { color: "grey", align: "left" },
        nameLocation: "start",
        show: false,
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
        areaStyle: { opacity: opacity },
        lineStyle: { color: "magenta", width: linewidth },
        data: totalOffers,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: "Total Incentives",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "cyan", width: linewidth },
        data: totalBribes,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "Avg $/1000 fB",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "orange", width: linewidth },
        data: avgPer1000,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        name: "Beets Price $",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "red", width: linewidth },
        data: priceBeets,
        xAxisIndex: 3,
        yAxisIndex: 3,
      },
      {
        name: "Voting APR %",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "white", width: linewidth },
        data: votingApr,
        xAxisIndex: 4,
        yAxisIndex: 4,
      },
      {
        name: "Total Voter",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "yellow", width: linewidth },
        data: totalVoter,
        xAxisIndex: 5,
        yAxisIndex: 5,
      },
      {
        name: "Total Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: areastyle,
        lineStyle: { color: "lime", width: linewidth },
        data: totalVotes,
        xAxisIndex: 6,
        yAxisIndex: 6,
      },
      {
        name: "Incentivised Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "green", width: linewidth },
        data: bribedVotes,
        xAxisIndex: 7,
        yAxisIndex: 7,
        //markPoint: { itemStyle: { color: "#15883b" } },
      },
      {
        name: "Incentivised Votes Ratio %",
        type: "bar",
        showSymbol: false,
        itemStyle: { opacity: 0.0 },
        data: bribedVotesRatio,
        xAxisIndex: 8,
        yAxisIndex: 8,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const offset = 1;

    if (params.dataIndex > 2) {
      let requestedRound = params.dataIndex + offset;
      requestedRound =
        requestedRound < 10 ? "0" + requestedRound : requestedRound;
      setBribeFile("bribe-data-" + requestedRound + ".json");
      setShowChart(false);
      console.log(
        "click",
        params.dataIndex,
        "->",
        "bribe-data-" + requestedRound + ".json"
      );
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
        style={{ height: 1000 }}
      />
      <Typography variant="body2" align="center">
        (clicking on data points loads historical pages)
      </Typography>
    </>
  );
});

export default Chart1;
