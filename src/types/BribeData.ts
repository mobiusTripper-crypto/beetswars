//import { boolean, number, string } from "yargs";

interface RewardType {
  type: string;
  percentagethreshold: number;
  token: string;
  amount: number;
  isfixed: boolean;
  tokenaddress: string;
  coingeckoid: string;
}

export interface BribeDataType {
  enabled: boolean;
  voteindex: number;
  poolname: string;
  poolurl: string;
  rewarddescription: string;
  assumption: string;
  fixedreward: TokenData[];
  percentreward: TokenData[];
  percentagethreshold: number;
  rewardcap: number;
  reward: RewardType[];
  additionalrewards: AdditionalRewards[];
}

export interface Bribes {
  version: string;
  proposal: string;
  description: string;
  round: number;
  snapshot: string;
  bribedata: BribeDataType[];
}

export interface TokenData {
  token: string;
  amount: number;
  isfixed: boolean;
}

export interface TokenPrice {
  token: string;
  price: number;
}

export interface TokenPriceData {
  token: string;
  address: string;
  cgid: string;
}

export interface AdditionalRewards {
  tier: string;
  factor: number;
}
