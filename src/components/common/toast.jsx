import { useState, useEffect } from "react";
import styles from "../../styles/common/toast.module.css";
import PropTypes from "prop-types";

Toast.propTypes = {
  message: PropTypes.string,
  setToastMsg: PropTypes.func,
  isErrorStyle: PropTypes.bool,
};

export function Toast({ message, setToastMsg, isErrorStyle = true }) {
  const [show, setShow] = useState(
    `${styles["snackbar"]} ${styles["show"]} ${
      isErrorStyle ? styles["error"] : styles["normal"]
    }`
  );
  useEffect(() => {
    setTimeout(() => {
      setShow(`${styles["snackbar"]}`);
      setToastMsg("");
    }, 1500);
  }, [setToastMsg]);
  return (
    <div id="snackbar" className={show}>
      {message}
    </div>
  );
}
