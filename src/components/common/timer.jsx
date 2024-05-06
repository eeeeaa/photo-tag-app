import { useState, useRef, useEffect } from "react";
import { format } from "../../utils/dateUtils";
import styles from "../../styles/common/timer.module.css";
export function Timer() {
  const [milliSeconds, setMilliSeconds] = useState(0);
  const interval = useRef();
  useEffect(() => {
    let lastMillisecs = milliSeconds;
    interval.current = setInterval(
      () => setMilliSeconds(lastMillisecs + 10),
      10
    );
    return () => clearInterval(interval.current);
  }, [milliSeconds]);

  return <div className={styles["timer"]}>{format(milliSeconds)}</div>;
}
