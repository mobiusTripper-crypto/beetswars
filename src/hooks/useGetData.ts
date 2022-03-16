import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Bribes, TokenPrice } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType } from "types/Dashboard";
import useRefresh from "hooks/useRefresh";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { getResults } from "hooks/voteSnapshot";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

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
  const dataUrl = process.env.REACT_APP_BRIBE_DATA_URL + "bribe-data-6.json";

  //  const dispatch = useDispatch();
  const { slowRefresh } = useRefresh();

  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("get vote data " + new Date(Date.now()));

      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ftm.tools"
      );
      const contract = new ethers.Contract(
        contract_address,
        contract_abi,
        provider
      );

      // const beetsPrice = await contract.calculateAssetPrice(
      //   "0xf24bcf4d1e507740041c9cfd2dddb29585adce1e"
      // );
      const ringPrice = await contract.calculateAssetPrice(
        "0x582423C10c9e83387a96d00A69bA3D11ee47B7b5"
      );
      // const supaPrice = await contract.calculateAssetPrice(
      //   "0x59D07a115fe3FFe5db3D52029D43Cc0ef5e9ba08"
      // );
      // const fbeetsPrice = await contract.calculateAssetPrice(
      //   "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1"
      // );

      //      set fixed prices from the end of gauge 5 votes, goto bottom of this file
      const tokenPrices: TokenPrice[] = [
        // {
        //   token: "BEETS",
        //   price: parseFloat(ethers.utils.formatEther(beetsPrice)),
        // },
        {
          token: "RING",
          price: parseFloat(ethers.utils.formatEther(ringPrice)),
        },
        // {
        //   token: "SUPA",
        //   price: parseFloat(ethers.utils.formatEther(supaPrice)),
        // },
        // {
        //   token: "FBEETS",
        //   price: parseFloat(ethers.utils.formatEther(beetsPrice)) * 1.0152,
        // },
      ];

      const bribeData = await fetch(dataUrl || "")
        .then((response) => response.json())
        .then((response: Bribes) => {
          return response;
        });

      const voteData = await getResults().then((response: VoteDataType) => {
        return response;
      });

      const dashboardData = normalizeDashboardData(
        bribeData,
        voteData,
        tokenPrices
      );

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

    const normalizeDashboardData = (
      bribes: Bribes,
      voteData: VoteDataType,
      tokens: TokenPrice[]
    ) => {
      const list: DashboardType[] = [];
      // console.dir(voteData);
      // console.dir(bribes);

      bribes.bribedata.map((bribe) => {
        let rewardAmount = 0;
        const isFixedReward = bribe.fixedreward.length !== 0;
        if (isFixedReward) {
          bribe.fixedreward.map((reward) => {
            if (reward.isfixed) {
              rewardAmount += reward.amount;
            } else {
              const token = tokens.find((t) => t.token === reward.token);
              console.log(reward.token, token ? token.price : 0, reward.amount);
              rewardAmount += reward.amount * (token ? token.price : 0);
            }
            //console.log(rewardAmount, reward.token);
          });
        }

        let percentAmount = 0;
        const isPerecentReward = bribe.percentreward.length !== 0;
        if (isPerecentReward) {
          bribe.percentreward.map((reward) => {
            if (reward.isfixed) {
              percentAmount += reward.amount;
            } else {
              const token = tokens.find((t) => t.token === reward.token);
              // console.log(
              //   reward.token,
              //   token,
              //   reward.amount * (token ? token.price : 0)
              // );
              percentAmount += reward.amount * (token ? token.price : 0);
            }
            //            console.log(percentAmount, reward.token);
          });
        }

        const votePercentage =
          (voteData.votingResults.resultsByVoteBalance[bribe.voteindex] /
            voteData.votingResults.sumOfResultsBalance) *
          100;

        const isQualified = votePercentage > 0.15;

        const percentAboveThreshold = Math.max(
          0,
          votePercentage - bribe.percentagethreshold
        );
        const percentValue = percentAmount * percentAboveThreshold;

        const overallValue = Math.min(
          rewardAmount + percentValue,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          isQualified: isQualified,
          rewardDescription: bribe.rewarddescription,
          assumption: bribe.assumption,
          rewardValue: rewardAmount,
          ispercentage: isPerecentReward,
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

//end of gauge voting token price
// const tokenPrices: TokenPrice[] = [
//   {
//     token: "BEETS",
//     price: 0.7761880532901334,
//   },
//   {
//     token: "RING",
//     price: 1.4818958991180278,
//   },
//   {
//     token: "SUPA",
//     price: 0.0460032384969553,
//   },
//   {
//     token: "FBEETS",
//     price: 0.7761880532901334 * 1.0152,
//   },
// ];
