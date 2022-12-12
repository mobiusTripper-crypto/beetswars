interface AdditionalRewards {
  tier: string;
  factor: number;
}

export interface RoundList {
  roundnumber: string;
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
  percentAboveThreshold: number;
  voteTotal: number;
  votePercentage: number;
  valuePerVote: number;
  id: number;
  additionalrewards: AdditionalRewards[];
  LabelValue: LabelValuePair;
}

export interface DashboardReturn {
  results: DashboardType[];
  totalVotes: number;
  totalBribedVotes: number;
  totalBribeAmount: number;
  version: string;
  proposalState: string;
  proposalStart: number;
  proposalEnd: number;
  proposalTitle: string;
  proposalId: string;
  roundList: RoundList[];
}
