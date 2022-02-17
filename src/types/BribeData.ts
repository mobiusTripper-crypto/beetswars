import { boolean, number, string } from "yargs";

export interface BribeData {
  enabled: boolean;
  voteindex: number;
  poolname: string;
  poolurl: string;
  rewarddescription: string;
  rewardamount: number;
  percentage: boolean;
  percentagethreshold: number;
  percentagerewardamount: number;
  rewardcap: number;
}
