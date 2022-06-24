interface ResultsData {
  resultsByVoteBalance: any;
  resultsByStrategyScore: any;
  sumOfResultsBalance: any;
}

export interface VoteDataType {
  proposal: any;
  proposalStart: number;
  proposalEnd: number;
  proposalTitle: string;
  proposalId: string;
  proposalState: string;
  votingResults: ResultsData;
}
