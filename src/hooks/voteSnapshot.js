import { request } from "graphql-request";
import { PROPOSAL_QUERY, VOTES_QUERY } from "hooks/queries";
import lodash from "lodash";
//import configData from "config.json";

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
  { first, voter, skip } = { first: 50000, voter: "", skip: 0 }
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

export async function getResults(snapshotId) {

  const proposal = await getProposal(snapshotId);

//console.log(new Date(proposal.created * 1000),proposal.snapshot)
//console.log(snapshotId, proposal.id, proposal.state)

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

  return { proposal, votingResults };
}

export default getProposal;
