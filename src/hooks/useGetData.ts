import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Bribes } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType } from "types/Dashboard";
import useRefresh from "hooks/useRefresh";

import { getResults } from "hooks/voteSnapshot";

// export interface Bribes {
//   results: BribeDataType[];
// }

export interface DashboardReturn {
  results: DashboardType[];
  totalVotes: number;
  totalBribeAmount: number;
  version: string;
}

const useGetData = () => {
  const dataUrl = process.env.REACT_APP_BRIBE_DATA_URL + "bribe-data-5.json";

  //  const dispatch = useDispatch();
  const { slowRefresh } = useRefresh();

  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("get vote data " + new Date(Date.now()));

      const bribeData = await fetch(dataUrl || "")
        .then((response) => response.json())
        .then((response: Bribes) => {
          return response;
        });

      const voteData = await getResults().then((response: VoteDataType) => {
        return response;
      });

      const dashboardData = normalizeDashboardData(bribeData, voteData);

      setDashboardResult({
        status: "loaded",
        payload: {
          results: dashboardData,
          totalVotes: voteData.votingResults.sumOfResultsBalance,
          totalBribeAmount: dashboardData
            .map((item) => item.overallValue)
            .reduce((prev, curr) => prev + curr, 0),
          version: bribeData.version,
        },
      });
    };

    const normalizeDashboardData = (bribes: Bribes, voteData: VoteDataType) => {
      const list: DashboardType[] = [];
      // console.dir(voteData);
      // console.dir(bribes);

      bribes.bribedata.map((bribe) => {
        const votePercentage =
          (voteData.votingResults.resultsByVoteBalance[bribe.voteindex] /
            voteData.votingResults.sumOfResultsBalance) *
          100;

        let percentAboveThreshold = 0;
        let percentValue = 0;
        let overallValue = 0;
        let isQualified = false;

        if (votePercentage > 0.15) {
          // //special code for Stable Credit Sonata (CREDIT-etc
          // //Reward: 💳 3000$ in $Credit for each 1% (maximum of 10%) 💵 3000$ in USDC for every 1% above 10% (maximum of another 10%)
          // if (bribe.voteindex === 43 && votePercentage >= 10) {
          //   bribe.rewardamount = 30000;
          //   bribe.percentagethreshold = 10;
          // }

          percentAboveThreshold = Math.max(
            0,
            votePercentage - bribe.percentagethreshold
          );
          percentValue = bribe.percentagerewardamount * percentAboveThreshold;

          overallValue = Math.min(
            bribe.rewardamount + percentValue,
            isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
          );

          isQualified = true;
        }

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          isQualified: isQualified,
          rewardDescription: bribe.rewarddescription,
          assumption: bribe.assumption,
          rewardValue: bribe.rewardamount,
          ispercentage: bribe.ispercentage,
          percentAboveThreshold: percentAboveThreshold,
          percentValue: percentValue,
          overallValue: overallValue,
          voteTotal:
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          votePercentage: votePercentage,
          valuePerVote:
            overallValue /
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
        };

        list.push(data);
      });
      return list;
    };
    fetchDashboardData();
  }, [dataUrl, slowRefresh, setDashboardResult]);

  return dashboardResult;
};

export default useGetData;
