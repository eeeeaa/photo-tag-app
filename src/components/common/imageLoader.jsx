import styles from "../../styles/common/loadingPage.module.css";
import { useState, forwardRef } from "react";
export const ImageLoader = forwardRef(function ImageLoader({ url, alt }, ref) {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <span
        className={styles.loader}
        style={{ display: loading ? "flex" : "none" }}
      ></span>
      <img
        className={styles["image"]}
        style={{ display: loading ? "none" : "flex" }}
        src={url}
        alt={alt}
        ref={ref}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </>
  );
});
