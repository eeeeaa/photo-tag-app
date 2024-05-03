import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { useState } from "react";
import { getNormalizedPosition } from "../../utils/imageUtils";
import { useGetImage } from "../../domain/charImageUseCase";
import PropTypes from "prop-types";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";
import { Toast } from "../common/toast";
import { ContextMenu } from "../common/contextMenu";
import { GameContext } from "../../utils/contextProvider";
import { GiPositionMarker } from "react-icons/gi";

TargetBox.propTypes = {
  targetStyle: PropTypes.object,
};

Markers.propTypes = {
  markers: PropTypes.array,
};

Marker.propTypes = {
  posX: PropTypes.number,
  posY: PropTypes.number,
};

function TargetBox({ targetStyle }) {
  return <div className={styles["target-box"]} style={targetStyle}></div>;
}

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

function Markers({ markers }) {
  return (
    <>
      {markers.length > 0 ? (
        markers.map((marker) => {
          return (
            <Marker
              key={`${marker.posX}${marker.posY}`}
              posX={marker.posX}
              posY={marker.posY}
            />
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}

export default function Game() {
  const { globalCoords, localCoords, handleMouseMove } = useMousePosition();
  const [menuState, setMenuState] = useState({
    showMenu: false,
    xPos: 0,
    yPos: 0,
  });
  const [targetStyle, setTargetStyle] = useState({
    display: "none",
    position: `absolute`,
    top: `0px`,
    left: `0px`,
  });
  const [markers, setMarkers] = useState([]);
  const { charImage, characters, error, loading } = useGetImage();
  const [toastMsg, setToastMsg] = useState("");

  const WIDTH_PX = 960;
  const HEIGHT_PX = 678.4;

  const showToast = (message) => {
    if (toastMsg.length === 0) {
      setToastMsg(message);
    }
  };
  const placeMarker = (posX, posY) => {
    let newMarkers = [...markers];
    if (!markers.includes({ posX, posY })) {
      newMarkers.push({ posX, posY });
    }

    setMarkers(newMarkers);
  };

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <GameContext.Provider
      value={{ showToast, placeMarker, WIDTH_PX, HEIGHT_PX }}
    >
      <div className={styles["game-layout"]}>
        <div>{JSON.stringify(localCoords)}</div>
        <div>
          {JSON.stringify(
            getNormalizedPosition(
              WIDTH_PX,
              HEIGHT_PX,
              localCoords.x,
              localCoords.y
            )
          )}
        </div>

        <div
          onClick={(e) => {
            if (e.target.getAttribute("id") === "game-image-area")
              handleMouseMove(e, (local, global) => {
                setTargetStyle({
                  display: "flex",
                  position: `absolute`,
                  top: `${local.y - 12}px`,
                  left: `${local.x - 12}px`,
                });
                setMenuState({
                  showMenu: true,
                  xPos: local.x,
                  yPos: local.y,
                });
              });
          }}
          className={styles["image-box"]}
          id="game-image-area"
        >
          <ContextMenu
            showMenu={menuState.showMenu}
            xPos={menuState.xPos}
            yPos={menuState.yPos}
            characters={characters}
          />
          <TargetBox targetStyle={targetStyle} />
          <Markers markers={markers} />

          {toastMsg.length > 0 ? (
            <Toast message={toastMsg} setToastMsg={setToastMsg} />
          ) : (
            <></>
          )}

          <img src={charImage.image_url} className={styles["image"]} />
        </div>
      </div>
    </GameContext.Provider>
  );
}
