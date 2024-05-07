import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { Toast } from "../common/toast";
import { Target } from "../common/target";
import { Timer } from "../common/timer";
import { Markers } from "../common/marker";
import { ImageLoader } from "../common/imageLoader";
import { useGetCharacters } from "../../domain/charImageUseCase";
import { useState, useContext, useEffect, useRef } from "react";
import { getNormalizedPosition } from "../../utils/imageUtils";

import { GameContext } from "../../utils/contextProvider";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";

export function ActiveGame() {
  const { handleMouseMove } = useMousePosition();
  const [menuState, setMenuState] = useState({
    showMenu: false,
    showTargetBox: false,
    normalX: 0,
    normalY: 0,
  });
  const [toastMsg, setToastMsg] = useState("");
  const { charImage, markers } = useContext(GameContext);
  const { characters, error, loading } = useGetCharacters(charImage._id);

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const observedDiv = useRef(null);

  useEffect(() => {
    if (!observedDiv.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (observedDiv.current.offsetWidth !== width) {
        setWidth(observedDiv.current.offsetWidth);
      }
      if (observedDiv.current.offsetHeight !== height) {
        setHeight(observedDiv.current.offsetHeight);
      }
    });

    resizeObserver.observe(observedDiv.current);

    return function cleanup() {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observedDiv.current]);

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div
      className={styles["game-layout"]}
      onContextMenu={(e) => {
        e.preventDefault();
        if (menuState.showTargetBox) {
          setMenuState({
            ...menuState,
            showMenu: !menuState.showMenu,
          });
        }
      }}
    >
      <Timer />
      <div>
        <p>
          How to play: left click to select target, open menu with right click
        </p>
      </div>
      <div
        onClick={(e) => {
          if (e.target.getAttribute("id") === "game-image-area")
            handleMouseMove(e, (local) => {
              const { normalX, normalY } = getNormalizedPosition(
                width,
                height,
                local.x,
                local.y
              );
              setMenuState({
                showMenu: false,
                showTargetBox: true,
                normalX: normalX,
                normalY: normalY,
              });
            });
        }}
        className={styles["image-box"]}
        id="game-image-area"
      >
        <Target
          menuState={menuState}
          toastMsg={toastMsg}
          setToastMsg={setToastMsg}
          width={width}
          height={height}
          characters={characters}
        />
        <Markers markers={markers} width={width} height={height} />

        {toastMsg.length > 0 ? (
          <Toast message={toastMsg} setToastMsg={setToastMsg} />
        ) : (
          <></>
        )}

        <ImageLoader
          url={charImage.image_url}
          alt={charImage._id}
          ref={observedDiv}
        />
      </div>
    </div>
  );
}
