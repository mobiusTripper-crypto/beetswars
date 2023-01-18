import React from "react";
import { useRef, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useGlobalContext } from "contexts/GlobalContext";
import { ChartData } from "types/ChartData";

// set false for json files, set true for backend
const USE_API = true;

const Chart1 = React.memo(() => {
  const dataUrl = USE_API
    ? "https://v2.beetswars.live/api/v1/chartdata"
    : "https://data.beetswars.live/chart-data-from-api.json";
  const { requestRound, setShowChart } = useGlobalContext();
  const [isLoaded, setLoaded] = useState(false);
  const [chartData, setData] = useState<ChartData>();

  const linewidth = "2";
  const opacity = "0.04";
  const areastyle = { opacity: opacity };

  const fetchData = async () => {
    const res = await fetch(dataUrl);
    const json = (await res.json()) as ChartData;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  chartData?.chartdata.sort((a, b) => (a.voteEnd > b.voteEnd ? 1 : -1));

  //  console.log(chartData);

  const rounds = chartData?.chartdata.map((round) => {
    return "Round " + round.round;
  });
  const bribedVotes = chartData?.chartdata.map((round) => {
    return round.bribedVotes;
  });
  const bribedVotesRatio = chartData?.chartdata.map((round) => {
    return ((round.bribedVotes / round.totalVotes) * 100).toFixed(2);
  });
  const totalVotes = chartData?.chartdata.map((round) => {
    return round.totalVotes;
  });
  const totalVoter = chartData?.chartdata.map((round) => {
    return round.totalVoter;
  });
  const totalBribes = chartData?.chartdata.map((round) => {
    return round.totalBribes === 0 ? "NaN" : round.totalBribes;
  });
  const totalOffers = chartData?.chartdata.map((round) => {
    return round.totalBriber;
  });
  const avgPer1000 = chartData?.chartdata.map((round) => {
    return ((round.totalBribes / round.bribedVotes) * 1000).toFixed(2);
  });
  const priceBeets = chartData?.chartdata.map((round) => {
    return round.priceBeets.toFixed(4);
  });
  /*
  const priceFbeets = chartData?.chartdata.map((round) => {
    return round.priceFbeets;
  });
*/
  const endTime = chartData?.chartdata.map((round) => {
    return new Date(round.voteEnd * 1000).toLocaleDateString("en-US");
  });
  const votingApr = chartData?.chartdata.map((round) => {
    return (round.totalBribes / round.priceFbeets / round.bribedVotes) * 2600;
  });
  const bribersRoi = chartData?.chartdata.map((round) => {
    return round.bribersRoi === 0 ? "NaN" : round.bribersRoi.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  //numRounds = rounds.length;

  const option = {
    color: [
      "magenta",
      "cyan",
      "cornflowerblue",
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
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
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
        top: "380",
      },
      {
        // index 2  bottom
        show: false,
        height: "240",
        left: "15%",
        right: "15%",
        top: "700",
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
        // bribeRoi
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
        offset: 7,
      },
      {
        name: "Total Incentives $",
        nameTextStyle: { color: "cyan", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cyan", align: "right" },
        gridIndex: 0,
        max: 1200000,
      },
      {
        name: "Bribers Roi %",
        nameTextStyle: { color: "cornflowerblue", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cornflowerblue", align: "left" },
        gridIndex: 0,
        position: "right",
        nameLocation: "start",
        offset: 23,
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
        name: "Total Incentives $",
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
        name: "Bribers Roi %",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "cornflowerblue", width: linewidth },
        data: bribersRoi,
        xAxisIndex: 2,
        yAxisIndex: 2,
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
        xAxisIndex: 3,
        yAxisIndex: 3,
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
        xAxisIndex: 4,
        yAxisIndex: 4,
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
        xAxisIndex: 5,
        yAxisIndex: 5,
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
        xAxisIndex: 6,
        yAxisIndex: 6,
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
        xAxisIndex: 7,
        yAxisIndex: 7,
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
        xAxisIndex: 8,
        yAxisIndex: 8,
        //markPoint: { itemStyle: { color: "#15883b" } },
      },
      {
        name: "Incentivised Votes Ratio %",
        type: "bar",
        showSymbol: false,
        itemStyle: { opacity: 0.0 },
        data: bribedVotesRatio,
        xAxisIndex: 9,
        yAxisIndex: 9,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const offset = 1;

    if (params.dataIndex > 2) {
      let requestedRound = params.dataIndex + offset;
      requestedRound =
        requestedRound < 10 ? "0" + requestedRound : requestedRound;
      requestRound(requestedRound);
      setShowChart(false);
      console.log("click", params.dataIndex, "->", "request " + requestedRound);
    }
  };

  const onEvents = {
    click: onChartClick,
  };

  if (!isLoaded) {
    return (
      <>
        <Typography variant="body2" align="center">
          Chart loading ...
        </Typography>
      </>
    );
  }

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
