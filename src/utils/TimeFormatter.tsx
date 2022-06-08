
type Props = { ts: number };

const TimeFormatter: FC<Props> = ( ts ) => {
  const days: number  = Math.floor(ts/86400);
  ts -= days * 86400;
  const hours = Math.floor(ts/3600) % 24;
  ts -= hours * 3600;
  const minutes = Math.floor(ts/60) % 60;
  ts -= minutes * 60;
  const seconds = ts % 60;
  return ((days > 0 ? days + "d ": "") + (hours > 0 ? hours + "h ": "") +
          minutes + "m " + (days === 0 && hours === 0 && minutes < 5 ?  seconds + "s" : ""))
}

export default TimeFormatter 
