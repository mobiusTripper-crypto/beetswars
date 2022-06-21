export interface DashboardType {
  poolName: string;
  poolUrl: string;
  rewardDescription: string;
  assumption: string;
  isQualified: boolean;
  rewardValue: number;
  ispercentage: boolean;
  percentAboveThreshold: number;
  percentValue: number;
  overallValue: number;
  voteTotal: number;
  votePercentage: number;
  valuePerVote: number;
  id: number;
}

export interface DashboardReturn {
  results: DashboardType[];
  totalVotes: number;
  totalBribeAmount: number;
  version: string;
}
