//import { boolean, number, string } from "yargs";

export interface BribeDataType {
  enabled: boolean;
  voteindex: number;
  poolname: string;
  poolurl: string;
  rewarddescription: string;
  assumption: string;
  rewardamount: number;
  percentage: boolean;
  percentagethreshold: number;
  percentagerewardamount: number;
  rewardcap: number;
}

export interface Bribes {
  version: string;
  description: string;
  round: number;
  bribedata: BribeDataType[];
}
