export interface DashboardType {
  poolName: string;
  poolUrl: string;
  rewardDescription: string;
  rewardValue: number;
  percentAboveThreshold: number;
  percentValue: number;
  overallValue: number;
  voteTotal: number;
  votePercentage: number;
  valuePerVote: number;
}

// const fetchTopPlayers = async () => {
//   try {
//     const playerIds = await getTopPlayersApi(category, season)
//     const rawPlayers = await getPlayersByIdApi(playerIds)

//     setPlayers(normalizeApiPlayers(rawPlayers))
//   } catch (err) {
//     Bugsnag.notify(err)
//     setPlayers(null)
//   }
// }

// // Call function immediately
// fetchTopPlayers()
