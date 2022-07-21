import { useEffect, useState } from "react";
import { Bribes, TokenPrice, TokenPriceData } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType, DashboardReturn, BribeFiles } from "types/Dashboard";
import { getResults } from "hooks/voteSnapshot";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
import useTimer from "hooks/useTimer"

const useGetData = (bribeFile:string) => {

console.log(bribeFile)
  const dataUrl = process.env.REACT_APP_BRIBE_DATA_URL + bribeFile
  const historyUrl = "https://api.github.com/repos/mobiusTripper-crypto/beetswars-data/git/trees/main"
  //const historyUrl = "https://api.github.com/repos/RnZ3/beetswars-data/git/trees/rebuild"
  const [voteActive, setActive] = useState(false)
  const refreshInterval:(number|null) = voteActive ? 60000 : null  // ms or null
  const refresh = useTimer(refreshInterval)
  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });

  var tokenPriceData: TokenPriceData[] = []
  var tokenPrices: TokenPrice[] = []
  var bribeFiles: BribeFiles[] = []

  useEffect(() => {

    const fetchDashboardData = async () => {

      const historyData = await fetch(historyUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          console.log("return dirlist")
          return response;
        });

      const regex_bribefile = new RegExp('bribe-data-[0-9a]*.json');
      historyData.tree.forEach((item:any) => {
        if(regex_bribefile.test(item.path)) {
          const entry = { filename: item.path }
          bribeFiles.push(entry)
        }
      })

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

      setActive(((voteData.proposal.state === "active") || (voteData.proposal.state === "pending"))  ?  true : false)

      const endTime = new Date(voteData.proposal.end*1000).toLocaleDateString("de-DE").replace(/\./g, '-')
      console.log("state:",voteActive, voteData.proposal.state, refreshInterval, endTime)

      if(bribeData.tokendata) {
        bribeData.tokendata.forEach((td) => {
          const data:TokenPriceData = { token: td.token, tokenaddress: td.tokenaddress, coingeckoid: td.coingeckoid }
          tokenPriceData.push(data)
        })
      }

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
          const priceobj = await contract.calculateAssetPrice(tkn.tokenaddress)
          const price = parseFloat(ethers.utils.formatEther(priceobj))
          const data:TokenPrice = { token: tkn.token, price: parseFloat(ethers.utils.formatEther(priceobj))  }
          tokenPrices.push(data)
          console.log("return l tkn:",tkn.token,price)
        })
      } else {    // historical prices
        await Promise.all(
          tokenPriceData.map(async (tkn) => {
            const tknUrl = "https://api.coingecko.com/api/v3/coins/" + tkn.coingeckoid + "/history?date=" + endTime + "&localization=false"
            await fetch(tknUrl || "")
            .then((response) => {
              return response.json();
            })
            .then((response) => {
            const data:TokenPrice = { token: tkn.token, price: response.market_data.current_price.usd  }
            tokenPrices.push(data)
            })
          console.log("return h tkn:",tkn.token,tokenPrices)
          })
        )
      }

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
          bribeFiles: bribeFiles
        },
      });
    };

    const normalizeDashboardData = (
      bribes: Bribes,
      voteData: VoteDataType,
      tokenprice: TokenPrice[]
    ) => {

      const list: DashboardType[] = [];

      bribes.bribedata.forEach( (bribe) => {
        let rewardAmount = 0;
        const isFixedReward = bribe.fixedreward.length !== 0;
        if (isFixedReward) {
          bribe.fixedreward.forEach((reward) => {
            if (reward.isfixed) {
              rewardAmount += reward.amount;
            } else {
              const token = tokenprice.find((t) => t.token === reward.token);
              rewardAmount += reward.amount * (token ? token.price : 0);
            }
          });
        }

        let percentAmount = 0;
        const isPerecentReward = bribe.percentreward.length !== 0;
        if (isPerecentReward) {
          bribe.percentreward.forEach((reward) => {
            if (reward.isfixed) {
              percentAmount += reward.amount;
            } else {
              const token = tokenprice.find((t) => t.token === reward.token);
              percentAmount += reward.amount * (token ? token.price : 0);
            }
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
