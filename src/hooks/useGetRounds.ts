import { useEffect, useState } from "react";
import { RoundList } from "types/Dashboard";
import { baseUrl } from "./useGetData";

export function useGetRounds(): RoundList[] {
  const [roundList, setRoundList] = useState<RoundList[]>([]);
  useEffect(() => {
    const fetchList = async () => {
      const allRoundsIndex = await fetch(baseUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          const list = response
            .map((item: any, i: any) => {
              return item.key;
            })
            .sort()
            .reverse();
          return list;
        });
      await setRoundList(allRoundsIndex);
    };
    if (roundList.length === 0) {
      fetchList();
    }
  }, [roundList.length]);
  return roundList;
}
