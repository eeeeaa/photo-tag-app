import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNormalizedPosition } from "../../utils/imageUtils";
import { useGetImage } from "../../domain/charImageUseCase";
import PropTypes from "prop-types";
import { createPlayer, useUpdatePlayer } from "../../domain/playerUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";
import { Toast } from "../common/toast";
import { ContextMenu } from "../common/contextMenu";
import { GameContext, MenuContext } from "../../utils/contextProvider";
import { GiPositionMarker } from "react-icons/gi";
import { calculateTimeSpent } from "../../utils/dateUtils";

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

function ActiveGame() {
  const { localCoords, handleMouseMove } = useMousePosition();
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
  const [toastMsg, setToastMsg] = useState("");
  const { WIDTH_PX, HEIGHT_PX, charImage, characters, markers } =
    useContext(GameContext);
  return (
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
            handleMouseMove(e, (local) => {
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
        <MenuContext.Provider value={{ toastMsg, setToastMsg }}>
          <ContextMenu
            showMenu={menuState.showMenu}
            xPos={menuState.xPos}
            yPos={menuState.yPos}
            characters={characters}
          />
        </MenuContext.Provider>
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
  const { charImage, characters, error, loading } = useGetImage();
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [gameState, setGameState] = useState(<GameStart />);

  const WIDTH_PX = 960;
  const HEIGHT_PX = 678.4;

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <GameContext.Provider
      value={{
        charImage,
        characters,
        gameState,
        setGameState,
        markers,
        setMarkers,
        currentPlayer,
        setCurrentPlayer,
        WIDTH_PX,
        HEIGHT_PX,
      }}
    >
      {gameState}
    </GameContext.Provider>
  );
}
