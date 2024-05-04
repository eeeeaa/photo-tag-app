import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNormalizedPosition, getRawPosition } from "../../utils/imageUtils";
import {
  useGetFirstImage,
  useGetCharacters,
} from "../../domain/charImageUseCase";
import PropTypes from "prop-types";
import { createPlayer, useUpdatePlayer } from "../../domain/playerUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";
import { Toast } from "../common/toast";
import { ContextMenu } from "../common/contextMenu";
import { GameContext, MenuContext } from "../../utils/contextProvider";
import { GiPositionMarker } from "react-icons/gi";
import { calculateTimeSpent } from "../../utils/dateUtils";
import { TargetBox } from "../common/contextMenu";

Markers.propTypes = {
  markers: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
};

Marker.propTypes = {
  posX: PropTypes.number,
  posY: PropTypes.number,
};

Target.propTypes = {
  menuState: PropTypes.object,
  toastMsg: PropTypes.string,
  setToastMsg: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  characters: PropTypes.array,
};

function Target({
  menuState,
  toastMsg,
  setToastMsg,
  width,
  height,
  characters,
}) {
  let { posX, posY } = getRawPosition(
    width,
    height,
    menuState.normalX,
    menuState.normalY
  );
  let boxStyle = {
    display: "none",
    position: `absolute`,
    top: `0px`,
    left: `0px`,
  };

  if (menuState.showTargetBox) {
    boxStyle = {
      display: "flex",
      position: `absolute`,
      top: `${posY - 12}px`,
      left: `${posX - 12}px`,
    };
  }
  return (
    <>
      <MenuContext.Provider
        value={{
          toastMsg,
          setToastMsg,
          characters,
          posX,
          posY,
          normalX: menuState.normalX,
          normalY: menuState.normalY,
        }}
      >
        <ContextMenu showMenu={menuState.showMenu} />
      </MenuContext.Provider>
      <TargetBox targetStyle={boxStyle} />
    </>
  );
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

function Markers({ markers, width, height }) {
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
          return (
            <Marker
              key={`${marker.posX}${marker.posY}`}
              posX={posX}
              posY={posY}
            />
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}

function ActiveGame() {
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

        <img
          src={charImage.image_url}
          className={styles["image"]}
          ref={observedDiv}
        />
      </div>
    </div>
  );
}

function GameStart() {
  const { setGameState, setCurrentPlayer } = useContext(GameContext);
  const [name, setName] = useState("player");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { player, error } = await createPlayer({ player_name: name });
      if (error != null) {
        setGameState(<ErrorPage errorMsg={error.message} />);
        return;
      }
      setGameState(<ActiveGame />);
      setCurrentPlayer(player);
    } catch (error) {
      navigate("/error");
    }
  };
  return (
    <div className={styles["game-layout"]}>
      <div className={styles["start-form-layout"]}>
        <form onSubmit={handleSubmit} className={styles["start-form"]}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type="submit">Start game</button>
        </form>
      </div>
    </div>
  );
}

export function GameEnd() {
  const { currentPlayer } = useContext(GameContext);
  const date = new Date();

  const { player, error, loading } = useUpdatePlayer({
    playerId: currentPlayer._id,
    end_time: date.toISOString(),
  });

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;
  return (
    <div className={styles["game-layout"]}>
      <h2>{player.player_name}</h2>
      <div>
        time Spent: {calculateTimeSpent(player.start_time, player.end_time)}
      </div>
    </div>
  );
}

export default function Game() {
  const [markers, setMarkers] = useState([]);
  const { charImage, error, loading } = useGetFirstImage();

  const [currentPlayer, setCurrentPlayer] = useState({});
  const [gameState, setGameState] = useState(<GameStart />);

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <GameContext.Provider
      value={{
        charImage,
        gameState,
        setGameState,
        markers,
        setMarkers,
        currentPlayer,
        setCurrentPlayer,
      }}
    >
      {gameState}
    </GameContext.Provider>
  );
}
