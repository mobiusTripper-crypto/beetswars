interface ResultsData {
  resultsByVoteBalance: any;
  resultsByStrategyScore: any;
  sumOfResultsBalance: any;
}

export interface VoteDataType {
  proposal: any;
  votingResults: ResultsData;
}
