import gql from "graphql-tag";

export const VOTES_QUERY = gql`
  query Votes(
    $id: String!
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: OrderDirection
    $voter: String
  ) {
    votes(
      first: $first
      skip: $skip
      where: { proposal: $id, vp_gt: 0, voter: $voter }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ipfs
      voter
      choice
      vp
      vp_by_strategy
    }
  }
`;

export const PROPOSAL_QUERY = gql`
  query Proposal($id: String!) {
    proposal(id: $id) {
      id
      ipfs
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      created
      plugins
      network
      type
      strategies {
        name
        params
      }
      space {
        id
        name
      }
      scores_state
      scores
      scores_by_strategy
      scores_total
      votes
    }
  }
`;
