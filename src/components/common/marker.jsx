import styles from "../../styles/routes/game.module.css";
import { GiPositionMarker } from "react-icons/gi";
import { getRawPosition } from "../../utils/imageUtils";
import PropTypes from "prop-types";

Markers.propTypes = {
  markers: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
};

Marker.propTypes = {
  posX: PropTypes.number,
  posY: PropTypes.number,
};

function Marker({ posX, posY }) {
  let style = {
    display: "flex",
    position: `absolute`,
    top: `${posY - 12}px`,
    left: `${posX - 12}px`,
  };
  return (
    <div className={styles["marker"]} style={style}>
      <GiPositionMarker className={styles["marker-icon"]} />
    </div>
  );
}

export function Markers({ markers, width, height }) {
  return (
    <>
      {markers.length > 0 ? (
        markers.map((marker) => {
          let { posX, posY } = getRawPosition(
            width,
            height,
            marker.normalX,
            marker.normalY
          );
          return <Marker key={crypto.randomUUID()} posX={posX} posY={posY} />;
        })
      ) : (
        <></>
      )}
    </>
  );
}
