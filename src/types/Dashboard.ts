interface AdditionalRewards {
  tier: string;
  factor: number;
}

export interface BribeFiles {
  filename: string;
}

interface LabelValuePair {
  label: string,
  value: number,
}

export interface DashboardType {
  poolName: string;
  poolUrl: string;
  rewardDescription: string;
  assumption: string;
  isQualified: boolean;
  rewardValue: number;
  ispercentage: boolean;
  percentAboveThreshold: number;
  overallValue: number;
  voteTotal: number;
  votePercentage: number;
  valuePerVote: number;
  id: number;
  additionalrewards: AdditionalRewards[];
  LabelValue: { label: string, value: number };
}

export interface DashboardReturn {
  results: DashboardType[];
  totalVotes: number;
  totalBribeAmount: number;
  version: string;
  proposalState: string;
  proposalStart: number;
  proposalEnd: number;
  proposalTitle: string;
  proposalId: string;
  bribeFiles: BribeFiles[];
}
