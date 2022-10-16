import React from "react";
import { useRef, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useGlobalContext } from "contexts/GlobalContext";


const Chart1 = React.memo( () => {
  const dataUrl =
    "https://beetswars-data-git-chartdata-rnz3.vercel.app/chart-data.json";
  const { bribeFile, setBribeFile, setShowChart } = useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chData, setData] = useState([]);
  var chartData = [];
  var rounds = [];
  var totalVotes = [];
  var totalVoter = [];
  var totalBribes = [];
  var totalOffers = [];
  var avgPer1000 = [];
  var endTime = [];
  var numRounds = 0;

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
    totalVotes = chartData.chartdata.map(function (round: any) {
      return round.totalVotes;
    });
    totalVoter = chartData.chartdata.map(function (round: any) {
      return round.totalVoter;
    });
    totalBribes = chartData.chartdata.map(function (round: any) {
      return round.totalBribes;
    });
    totalOffers = chartData.chartdata.map((round: any) => {
      return round.totalBriber;
    });
    avgPer1000 = chartData.chartdata.map(function (round: any) {
      return ((round.totalBribes / round.totalVotes) * 1000).toFixed(2);
    });
    endTime = chartData.chartdata.map(function (round: any) {
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
        // Briber 0
        //backgroundColor: "#222222DD",
        //borderColor: "#222222",
        show: false,
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
        //backgroundColor: "#222222DD",
        //borderColor: "#222222",
        show: false,
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
        data: totalOffers,
        xAxisIndex: 0,
        yAxisIndex: 0,
        markPoint: { itemStyle: { color: "#F57EFF" } },
      },
      {
        name: "avg $/1000",
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
        data: totalBribes,
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
        data: totalVoter,
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
        data: totalVotes,
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
        style={{ height: 680 }}
      />
      <Typography variant="body2" align="center">
        (clicking on data points loads historical pages)
      </Typography>

    </>
  );
});

export default Chart1;
