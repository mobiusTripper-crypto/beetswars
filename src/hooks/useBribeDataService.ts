import { useEffect, useState } from "react";
import { BribeDataType } from "types/BribeData";
import { ServiceType } from "types/Service";

export interface Bribes {
  results: BribeDataType[];
}

const useBribeDataService = () => {
  const [result, setResult] = useState<ServiceType<Bribes>>({
    status: "loading",
  });

  const dataURL = "https://beetswars-data.vercel.app/bribe-data.json";

  useEffect(() => {
    fetch(dataURL || "")
      .then((response) => response.json())
      .then((response) => {
        setResult({ status: "loaded", payload: response });
      })
      .catch((error) => {
        console.log("error: %s", error);
        setResult({ status: "error", error });
      });
  }, [dataURL]);
  return result;
};

export default useBribeDataService;
