import { useEffect, useState } from "react";
//import { useDispatch } from "react-redux";
import { Bribes, TokenPrice } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType, DashboardReturn } from "types/Dashboard";
//import useRefresh from "hooks/useRefresh";
//import Web3 from "web3";
//import { AbiItem } from "web3-utils";
import { getResults } from "hooks/voteSnapshot";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
//import { BigNumber } from "@ethersproject/bignumber";
//import configData from "config.json";
import useTimer from "hooks/useTimer"


const useGetData = () => {

  const dataUrl = process.env.REACT_APP_BRIBE_DATA_URL + "bribe-data-latest.json"
  const [voteActive, setActive] = useState(true)
  const [tknReady, setTknReady] = useState(false)
  const refreshInterval:(number|null) = voteActive ? 60000 : null  // ms or null
//  const priceProvider:(string) = voteActive ? "activeFeed" : "historicFeed"
  const refresh = useTimer(refreshInterval)
  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });


    var tokenPriceData: [] = []
    var tokenPrices: TokenPrice [] = [{token: "BLA", price: 0}]

  useEffect(() => {

    const fetchDashboardData = async () => {

      const bribeData = await fetch(dataUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response: Bribes) => {
console.log("return bribes")
          return response;
        });

      const voteData = await getResults(bribeData.snapshot).then((response: VoteDataType) => {
console.log("return vote")
        return response;
      });

      setActive(voteData.proposal.state === "active" ?  true : false)

console.log("state:",voteActive, voteData.proposal.state, refreshInterval, 
            new Date(voteData.proposal.end*1000).toLocaleDateString("de-DE").replace(/\./g, '-'))

      const endTime = new Date(voteData.proposal.end*1000).toLocaleDateString("de-DE").replace(/\./g, '-')


      bribeData.bribedata.forEach((bribe) => {
if (bribe.reward) {
        bribe.reward.forEach((rw) => {
          if (!rw.isfixed) {
            if(!tokenPriceData.find((tpf) =>  tpf.token === rw.token)) {
              const data:[] = { token: rw.token, address: rw.tokenaddress, cgid: rw.coingeckoid }
              tokenPriceData.push(data)
              console.log("return token data",rw.token)
            } else {
              console.log("return dup:",rw.token)
            }
          }
        })
}
      })


      if (voteActive) {    // realtime prices
        const provider = new ethers.providers.JsonRpcProvider(
          "https://rpc.ftm.tools"
        );
        const contract = new ethers.Contract(
          contract_address,
          contract_abi,
          provider
        );
        tokenPriceData.forEach(async (tkn) => {
          const priceobj = await contract.calculateAssetPrice(tkn.address)
          const price = parseFloat(ethers.utils.formatEther(priceobj))
          const data:TokenPrice = { token: tkn.token, price: parseFloat(ethers.utils.formatEther(priceobj))  }
          tokenPrices.push(data)
          console.log("return l tkn:",tkn.token,price)
        })
      } else {    // historical prices
        tokenPriceData.forEach(async (tkn) => {
          const tknUrl = "https://api.coingecko.com/api/v3/coins/" + tkn.cgid + "/history?date=" + endTime + "&localization=false"
          const priceobj = await fetch(tknUrl || "")
          .then((response) => {
            return response.json();
          })
          const price = priceobj.market_data.current_price.usd
          const data:TokenPrice = { token: tkn.token, price: priceobj.market_data.current_price.usd  }
          tokenPrices.push(data)
          console.log("return h tkn:",tkn.token,price)
        })
      }

//      const dataBlub:TokenPrice = { token: "BLUB", price: 0.000001  }
//      tokenPrices.push(dataBlub)
//      console.log(tokenPrices);

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
          proposalStart: voteData.proposal.start,
          proposalEnd: voteData.proposal.end,
          proposalTitle: voteData.proposal.title,
          proposalId: bribeData.snapshot,
          proposalState: voteData.proposal.state,
        },
      });
    };

    const normalizeDashboardData = (
      bribes: Bribes,
      voteData: VoteDataType,
      tokken: TokenPrice[]
    ) => {
      const list: DashboardType[] = [];
      // console.dir(voteData);

      console.log(tokken);

      tokken.forEach( (tkk) => {
        console.log(tkk.token,tkk.price,tokken.length)
      })

      bribes.bribedata.forEach((bribe) => {
        let rewardAmount = 0;
        const isFixedReward = bribe.fixedreward.length !== 0;
        if (isFixedReward) {
          bribe.fixedreward.forEach((reward) => {
            if (reward.isfixed) {
              rewardAmount += reward.amount;
            } else {
              const token = tokken.find((t) => t.token === reward.token);
              console.log("muh ",reward.token, token ? token.price : 0, reward.amount);
              rewardAmount += reward.amount * (token ? token.price : 0);
            }
            //console.log(rewardAmount, reward.token);
          });
        }

        let percentAmount = 0;
        const isPerecentReward = bribe.percentreward.length !== 0;
        if (isPerecentReward) {
          bribe.percentreward.forEach((reward) => {
            if (reward.isfixed) {
              percentAmount += reward.amount;
            } else {
              const token = tokken.find((t) => t.token === reward.token);
               console.log("mäh ",
                 reward.token,
                 token,
                 reward.amount * (token ? token.price : 0)
               );
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
        const percentValue = Math.min(
          percentAmount * percentAboveThreshold,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const overallValue = Math.min(
          rewardAmount + percentValue,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        //     console.log(overallValue, rewardAmount, percentValue, bribe.rewardcap);
        //     console.log(voteData.proposal.start, voteData.proposal.end, voteData.proposal.state);

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          isQualified: isQualified,
          rewardDescription: bribe.rewarddescription,
          assumption: bribe.assumption,
          additionalrewards: bribe.additionalrewards,
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
          id: bribe.voteindex,
        };

        list.push(data);
      });
console.log("return list")
      return list;
    };
    fetchDashboardData();
  }, [ dataUrl, refresh, setDashboardResult, refreshInterval, voteActive, ]);

  return dashboardResult;
};

export default useGetData;

//end of gauge 5 voting token price
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

//end of gauge 6 voting token price
// {
//   token: "BEETS",
//   price: 0.6342,
//   //price: parseFloat(ethers.utils.formatEther(beetsPrice)),
// },
// {
//   token: "RING",
//   price: 0.801435,
//   //price: parseFloat(ethers.utils.formatEther(ringPrice)),
// },

// end of gaug vote 8
// token: "BEETS",
// //price: parseFloat(ethers.utils.formatEther(beetsPrice)),
// price: 0.465,
// },
// {
// token: "OATH",
// //price: parseFloat(ethers.utils.formatEther(oathPrice)),
// pr





/*  from line 103

      const beetsPrice = await contract.calculateAssetPrice(
        "0xf24bcf4d1e507740041c9cfd2dddb29585adce1e"
      );

      // const oathPrice = await contract.calculateAssetPrice(
      //   "0x21ada0d2ac28c3a5fa3cd2ee30882da8812279b6"
      // );
      // const ringPrice = await contract.calculateAssetPrice(
      //   "0x582423C10c9e83387a96d00A69bA3D11ee47B7b5"
      // );
//      const ftmPrice = await contract.calculateAssetPrice(
//        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
//      );
      // const fbeetsPrice = await contract.calculateAssetPrice(
      //   "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1"
      // );
//      const panicPrice = await contract.calculateAssetPrice(
//        "0xa882ceac81b22fc2bef8e1a82e823e3e9603310b"
//      );

      //      fixed prices from the end of gauge, goto bottom of this file
      const tokenPrices: TokenPrice[] = [
        {
          token: "BEETS",
          price: parseFloat(ethers.utils.formatEther(beetsPrice)),
          //          price: 0.465,
        },
//        {
//          token: "OATH",
//          //price: parseFloat(ethers.utils.formatEther(oathPrice)),
//          price: 0.206,
//        },
//        {
//          token: "FTM",
//          price: parseFloat(ethers.utils.formatEther(ftmPrice)),
//        },
//        {
//          token: "PANIC",
//          price: parseFloat(ethers.utils.formatEther(panicPrice)),
//        },
        // {
        //   token: "FBEETS",
        //   price: parseFloat(ethers.utils.formatEther(beetsPrice)) * 1.0152,
        // },
      ];
*/
