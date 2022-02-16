interface ResultsData {
  resultsByVoteBalance: any;
  resultsByStrategyScore: any;
  sumOfResultsBalance: any;
}

export interface VoteData {
  proposal: any;
  votingResults: ResultsData;
}

// (property) ServiceLoaded<VoteData>.payload: VoteData
// Property 'Results' is missing in type
// '{ proposal: any; votingResults:
//   { resultsByVoteBalance: any; resultsByStrategyScore: any; sumOfResultsBalance: any; }; }'
//   but required in type 'VoteData'.ts(2741)
