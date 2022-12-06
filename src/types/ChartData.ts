export interface ChartData {
  chartdata: ChartDataType[];
}

interface ChartDataType {
  round: number;
  bribedVotes: number;
  voteEnd: number;
  totalBribes: number;
  totalBriber: number;
  priceFbeets: number;
  priceBeets: number;
  totalVoter: number;
  totalVotes: number;
}
