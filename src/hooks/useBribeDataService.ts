import { useEffect, useState } from "react";
import { BribeData } from "types/BribeData";
import { Service } from "types/Service";

export interface Bribes {
  results: BribeData[];
}

const useBribeDataService = () => {
  const [result, setResult] = useState<Service<Bribes>>({
    status: "loading",
  });

  const dataURL = "https://beetswars-data.vercel.app/bribe-data.json";
  console.log({ dataURL });

  useEffect(() => {
    fetch(dataURL || "")
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setResult({ status: "loaded", payload: response });
      })
      .catch((error) => {
        console.log("error: %s", error);
        setResult({ status: "error", error });
      });
  }, [dataURL]);

  console.log(result);

  return result;
};

export default useBribeDataService;
