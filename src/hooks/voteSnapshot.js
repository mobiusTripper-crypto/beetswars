import { request } from "graphql-request";
import { PROPOSAL_QUERY, VOTES_QUERY } from "hooks/queries";
import lodash from "lodash";

import snapshot from "@snapshot-labs/snapshot.js";

const endpoint = "https://hub.snapshot.org/graphql";

async function getProposal(id) {
  try {
    const response = await request(endpoint, PROPOSAL_QUERY, {
      id,
    });
    const proposalResClone = lodash.cloneDeep(response);

    return proposalResClone.proposal;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getProposalVotes(
  proposalId,
  { first, voter, skip } = { first: 30000, voter: "", skip: 0 }
) {
  try {
    const response = await request(endpoint, VOTES_QUERY, {
      id: proposalId,
      orderBy: "vp",
      orderDirection: "desc",
      first,
      voter,
      skip,
    });

    const votesResClone = lodash.cloneDeep(response);
    return votesResClone.votes;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function getResults() {
  const proposal = await getProposal(
    "0xd00700ca5bf26078d979a55fbbb1f25651791afd1aff6f951422fa6903e3424c"
  );
  //round 4 gauge proposal id
  //0xd00700ca5bf26078d979a55fbbb1f25651791afd1aff6f951422fa6903e3424c
  //round 3 guage propsal id
  //0x8f28b88f32c80b3212afb0e850c6230023284fa33ccc2c14690c20195a086cb

  //  "0xef17a8cb27e3d01538a20b90d2628379290376d15947238e8f19c99e1cb42d14"
  console.log("choices");
  console.dir(proposal.choices);
  const votes = await getProposalVotes(proposal.id);

  const voters = votes.map((vote) => vote.voter);

  const scores = await snapshot.utils.getScores(
    "beets.eth",
    proposal.strategies,
    proposal.network,
    voters,
    parseInt(proposal.snapshot, 10),
    "https://score.snapshot.org/api/scores"
  );

  const votes1 = votes
    .map((vote) => {
      vote.scores = proposal.strategies.map(
        (strategy, i) => scores[i][vote.voter] || 0
      );
      vote.balance = vote.scores.reduce((a, b) => a + b, 0);
      return vote;
    })
    .sort((a, b) => b.balance - a.balance)
    .filter((vote) => vote.balance > 0);

  console.log("votingResults1");
  const votingClass = new snapshot.utils.voting[proposal.type](
    proposal,
    votes1,
    proposal.strategies
  );
  const votingResults = {
    resultsByVoteBalance: votingClass.resultsByVoteBalance(),
    resultsByStrategyScore: votingClass.resultsByStrategyScore(),
    sumOfResultsBalance: votingClass.sumOfResultsBalance(),
  };
  console.log("votingResults3");
  console.log(votingResults);

  return { proposal, votingResults };
}

export default getProposal;

// const votingClass = new voting[proposal.type](proposal, votes, strategies);
// const results = {
//   resultsByVoteBalance: votingClass.resultsByVoteBalance(),
//   resultsByStrategyScore: votingClass.resultsByStrategyScore(),
//   sumOfResultsBalance: votingClass.sumOfResultsBalance(),
// };
