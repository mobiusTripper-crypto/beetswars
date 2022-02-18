import { useEffect, useState } from "react";
import { BribeDataType } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType } from "types/Dashboard";

import { getResults } from "hooks/voteSnapshot";

export interface Bribes {
  results: BribeDataType[];
}

export interface listType {
  results: DashboardType[];
}

const useGetData = () => {
  console.log("getData");

  const dataURL = "https://beetswars-data.vercel.app/bribe-data.json";

  const [bribeResult, setBribeResult] = useState<ServiceType<Bribes>>({
    status: "loading",
  });

  const [voteResult, setVoteResult] = useState<ServiceType<VoteDataType>>({
    status: "loading",
  });

  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardType[]>
  >({ status: "loading" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const bribeData = await fetch(dataURL || "")
        .then((response) => response.json())
        .then((response: Bribes) => {
          return response;
        });

      const voteData = await getResults().then((response: VoteDataType) => {
        return response;
      });

      setDashboardResult({
        status: "loaded",
        payload: normalizeDashboardData(bribeData, voteData),
      });
    };

    const normalizeDashboardData = (bribes: Bribes, voteData: VoteDataType) => {
      const list: DashboardType[] = [];
      console.dir(voteData);

      bribes.results.map((bribe) => {
        const votePercentage =
          (voteData.votingResults.resultsByVoteBalance[bribe.voteindex] /
            voteData.votingResults.sumOfResultsBalance) *
          100;

        const percentAboveThreshold = Math.max(
          0,
          votePercentage - bribe.percentagethreshold
        );
        const percentValue =
          bribe.percentagerewardamount * percentAboveThreshold;

        const overallValue = bribe.rewardamount + percentValue;

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          rewardDescription: bribe.rewarddescription,
          rewardValue: bribe.rewardamount,
          percentAboveThreshold: percentAboveThreshold,
          percentValue: percentValue,
          overallValue: overallValue,
          voteTotal:
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          votePercentage: votePercentage,
          valuePerVote:
            bribe.rewardamount /
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
        };

        list.push(data);
      });
      return list;
    };
    fetchDashboardData();
  }, [dataURL]);

  return dashboardResult;
};

export default useGetData;
