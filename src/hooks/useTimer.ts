import { useState, useEffect } from "react";

export default function useTimer(interval:number|null)  {
  const [refresh, setRefresh] = useState(new Date())
  useEffect(() => {
    if(interval !== null) {
      var timerID = setInterval(() => timer(), interval)
      return () => clearInterval(timerID)
    }
  }, [ interval ] )

  function timer() {
      setRefresh(new Date())
  }
  return refresh
}

