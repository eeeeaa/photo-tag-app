import { useState, useEffect } from "react";
import styles from "../../styles/common/toast.module.css";
import PropTypes from "prop-types";

Toast.propTypes = {
  message: PropTypes.string,
  setToastMsg: PropTypes.func,
};

export function Toast({ message, setToastMsg }) {
  const [show, setShow] = useState(`${styles["snackbar"]} ${styles["show"]}`);
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
