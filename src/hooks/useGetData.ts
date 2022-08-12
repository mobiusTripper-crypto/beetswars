import { useEffect, useState } from "react";
import { Bribes, TokenData, TokenPrice, TokenPriceData, GenericReward } from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { DashboardType, DashboardReturn, BribeFiles } from "types/Dashboard";
import { getResults } from "hooks/voteSnapshot";
import { request } from "graphql-request";
import { BPT_ACT_QUERY } from "hooks/queries";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
import useTimer from "hooks/useTimer";

const useGetData = (bribeFile: string) => {
  //console.log(bribeFile);
  const dataUrl = process.env.REACT_APP_BRIBE_DATA_URL + bribeFile;
  const historyUrl =
    "https://api.github.com/repos/mobiusTripper-crypto/beetswars-data/git/trees/main";
  //const historyUrl = "https://api.github.com/repos/RnZ3/beetswars-data/git/trees/rebuild"
  const [voteActive, setActive] = useState(false);
  const refreshInterval: number | null = voteActive ? 60000 : null; // ms or null
  const refresh = useTimer(refreshInterval);
  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });

  var tokenPriceData: TokenPriceData[] = [];
  var tokenPrices: TokenPrice[] = [];
  var bribeFiles: BribeFiles[] = [];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const historyData = await fetch(historyUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          //console.log("return dirlist");
          return response;
        });

      const regex_bribefile = new RegExp("bribe-data-[0-9a]*.json");
      historyData.tree.forEach((item: any) => {
        if (regex_bribefile.test(item.path)) {
          const entry = { filename: item.path };
          bribeFiles.push(entry);
        }
      });

      const bribeData = await fetch(dataUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response: Bribes) => {
          //console.log("return bribes");
          return response;
        });

      const voteData = await getResults(bribeData.snapshot).then(
        (response: VoteDataType) => {
          //console.log("return vote");
          return response;
        }
      );

      setActive(
        voteData.proposal.state === "active" ||
          voteData.proposal.state === "pending"
          ? true
          : false
      );

      const endTime = new Date(voteData.proposal.end * 1000)
        .toLocaleDateString("de-DE")
        .replace(/\./g, "-");

      if (bribeData.tokendata) {
        bribeData.tokendata.forEach((td) => {
          const data: TokenPriceData = {
            token: td.token,
            tokenaddress: td.tokenaddress,
            coingeckoid: td.coingeckoid,
            bptpoolid: td.bptpoolid,
          };
          tokenPriceData.push(data);
        });
      }

      console.log(
        "state:",
        voteActive,
        voteData.proposal.state,
        refreshInterval,
        endTime,
        tokenPriceData
      );

      if (tokenPriceData.length !== 0) {
        if (voteActive) {
          // realtime prices

          await Promise.all(
            tokenPriceData.map(async (tkn) => {
              if (tkn.bptpoolid) {
                const endpoint =
                  "https://backend-v2.beets-ftm-node.com/graphql";

                const id = tkn.bptpoolid;

                const poolData = await request(endpoint, BPT_ACT_QUERY, {
                  id,
                }).then((response) => {
                  if (response.status >= 400 && response.status < 600) {
                    throw new Error("Bad response from server");
                  }
                  return response;
                });

                const sharePrice =
                  (await parseFloat(
                    poolData.poolGetPool.dynamicData.totalLiquidity
                  )) / parseFloat(poolData.poolGetPool.dynamicData.totalShares);

                const data: TokenPrice = {
                  token: tkn.token,
                  price: sharePrice,
                };
                tokenPrices.push(data);
                console.log("return bpt tkn:", tkn.token, sharePrice);

                //console.log(tokenPrices);
              } else {
                const provider = new ethers.providers.JsonRpcProvider(
                  "https://rpc.ftm.tools"
                );
                const contract = new ethers.Contract(
                  contract_address,
                  contract_abi,
                  provider
                );

                const priceobj = await contract.calculateAssetPrice(
                  tkn.tokenaddress
                );
                const price = parseFloat(ethers.utils.formatEther(priceobj));
                const data: TokenPrice = {
                  token: tkn.token,
                  price: parseFloat(ethers.utils.formatEther(priceobj)),
                };
                tokenPrices.push(data);
                console.log("return rpc tkn:", tkn.token, price);
              }
            })
          );
        } else {
          // historical prices
          await Promise.all(
            tokenPriceData.map(async (tkn) => {
              console.log("tkn:", tkn.coingeckoid);

              if (await tkn.coingeckoid) {
                const tknUrl =
                  "https://api.coingecko.com/api/v3/coins/" +
                  tkn.coingeckoid +
                  "/history?date=" +
                  endTime +
                  "&localization=false";

                await fetch(tknUrl || "")
                  .then((response) => {
                    return response.json();
                  })
                  .then((response) => {
                    const data: TokenPrice = {
                      token: tkn.token,
                      price: response.market_data.current_price.usd,
                    };
                    tokenPrices.push(data);
                  });
                console.log("return h tkn:", tkn.token, tokenPrices);
              }
            })
          );
        }
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
            .map((item) => item.LabelValue.value)
            .reduce((prev, curr) => prev + curr, 0),
          version: bribeData.version,
          proposalStart: voteData.proposal.start,
          proposalEnd: voteData.proposal.end,
          proposalTitle: voteData.proposal.title,
          proposalId: bribeData.snapshot,
          proposalState: voteData.proposal.state,
          bribeFiles: bribeFiles,
        },
      });
    };

    const normalizeDashboardData = (
      bribes: Bribes,
      voteData: VoteDataType,
      tokenprice: TokenPrice[]
    ) => {
      const list: DashboardType[] = [];

      function calculateG(reward: GenericReward) {
        let amount = 0;
        if (reward.isfixed) {
          amount += reward.amount;
        } else {
          const token = tokenprice.find((t) => t.token === reward.token);
          amount += reward.amount * (token ? token.price : 0);
        }
        return amount;
      }

      function calculate(reward: TokenData) {
        let amount = 0;
        if (reward.isfixed) {
          amount += reward.amount;
        } else {
          const token = tokenprice.find((t) => t.token === reward.token);
          amount += reward.amount * (token ? token.price : 0);
        }
        return amount;
      }

      bribes.bribedata.forEach((bribe) => {
        const votePercentage =
          (voteData.votingResults.resultsByVoteBalance[bribe.voteindex] /
            voteData.votingResults.sumOfResultsBalance) *
          100;

        const percentAboveThreshold = Math.max(
          0,
          votePercentage - bribe.percentagethreshold
        );

        const isUndervote = votePercentage < 0.15;
        const isUnderthreshold =
          bribe.payoutthreshold && votePercentage < bribe.payoutthreshold
            ? true
            : false;
        const isQualified = !isUndervote && !isUnderthreshold;

        let label = "";

        // reward

        let genericAmount = 0;
        const isGenericReward = bribe.reward && bribe.reward.length !== 0;
        if (isGenericReward) {
          bribe.reward.map((reward) => {
            genericAmount += calculateG(reward);
            console.log("G", genericAmount, reward.type,reward.rewardcap);
          });
        }

        // pervotereward

        let pervoteAmount = 0;
        const isPervoteReward =
          bribe.pervotereward && bribe.pervotereward.length !== 0;
        if (isPervoteReward) {
          label = "Per Vote Amount";
          bribe.pervotereward.forEach((reward) => {
            pervoteAmount += calculate(reward);
            console.log("V", pervoteAmount);
          });
        }

        // fixedreward

        let rewardAmount = 0;
        const isFixedReward =
          bribe.fixedreward && bribe.fixedreward.length !== 0;
        if (isFixedReward) {
          label = "Fixed Reward Amount";
          bribe.fixedreward.forEach((reward) => {
            rewardAmount += calculate(reward);
            console.log("F", rewardAmount);
          });
        }

        // percentreward

        let percentAmount = 0;
        const isPercentReward =
          bribe.percentreward && bribe.percentreward.length !== 0;
        if (isPercentReward) {
          label = "Percent Amount";
          bribe.percentreward.forEach((reward) => {
            percentAmount += calculate(reward);
            console.log("%", percentAmount);
          });
        }

        const arr: number = [
          isGenericReward,
          isPervoteReward,
          isFixedReward,
          isPercentReward,
        ].filter(Boolean).length;
        arr !== 1 && console.log(arr, "rewards not implemented");

        const percentValue = Math.min(
          percentAmount * percentAboveThreshold,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const overallValue = Math.min(
          rewardAmount + percentValue,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const overallPerVoteValue = Math.min(
          pervoteAmount *
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        let valuePerVote = 0;
        if (pervoteAmount !== 0) {
          valuePerVote = pervoteAmount;
          rewardAmount = overallPerVoteValue;
        } else {
          valuePerVote =
            overallValue /
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex];
        }

        const finalvalue = Math.max(
          0,
          percentValue,
          overallPerVoteValue,
          rewardAmount,
          genericAmount
        );

        //console.log( percentValue, overallPerVoteValue, rewardAmount, genericAmount)
        //console.log(label, finalvalue);

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          isQualified: isQualified,
          rewardDescription: bribe.rewarddescription,
          assumption: bribe.assumption,
          additionalrewards: bribe.additionalrewards,
          rewardValue: rewardAmount,
          ispercentage: isPercentReward,
          percentAboveThreshold: percentAboveThreshold,
          overallValue: overallValue,
          voteTotal:
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          votePercentage: votePercentage,
          valuePerVote: valuePerVote,
          id: bribe.voteindex,
          LabelValue: { label: label, value: finalvalue },
        };

        list.push(data);
      });
      //console.log("return list");
      return list;
    };
    fetchDashboardData();
  }, [dataUrl, refresh, setDashboardResult, refreshInterval, voteActive]);

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
