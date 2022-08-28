//import { boolean, number, string } from "yargs";

export interface GenericReward {
  type: string;
  token: string;
  amount: number;
  isfixed: boolean;
}

export interface BribeDataType {
  enabled: boolean;
  voteindex: number;
  poolname: string;
  poolurl: string;
  rewarddescription: string;
  assumption: string;
  percentagethreshold: number;
  rewardcap: number;
  reward: GenericReward[];
  additionalrewards: AdditionalRewards[];
  payoutthreshold: number;
}

export interface Bribes {
  version: string;
  proposal: string;
  description: string;
  round: number;
  snapshot: string;
  tokendata: TokenPriceData[];
  bribedata: BribeDataType[];
}

export interface TokenPrice {
  token: string;
  price: number;
}

export interface TokenPriceData {
  token: string;
  tokenaddress: string;
  coingeckoid: string;
  bptpoolid: string;
  isbpt: boolean;
  lastprice: number;
}

export interface AdditionalRewards {
  tier: string;
  factor: number;
}
