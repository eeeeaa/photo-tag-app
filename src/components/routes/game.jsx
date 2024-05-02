import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { useState, useRef, useLayoutEffect } from "react";
import { getNormalizedPosition } from "../../utils/imageUtils";
import { useGetImage } from "../../domain/charImageUseCase";
import PropTypes from "prop-types";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";

ContextMenuItem.propTypes = {
  character: PropTypes.object,
};

ContextMenu.propTypes = {
  showMenu: PropTypes.bool,
  xPos: PropTypes.number,
  yPos: PropTypes.number,
  characters: PropTypes.object,
};

TargetBox.propTypes = {
  targetStyle: PropTypes.object,
};

function ContextMenuItem({ character }) {
  return (
    <li className={styles["context-item"]}>
      <div className={styles["context-item-content"]}>
        <img
          src={character.char_profile_url}
          alt={character.char_name}
          className={styles["context-item-profile"]}
        />
        <div>{character.char_name}</div>
      </div>
    </li>
  );
}

function ContextMenu({ showMenu, xPos, yPos, characters }) {
  if (!showMenu) return null;
  return (
    <div
      className={styles["context-menu"]}
      style={{
        top: `${yPos + 24}px`,
        left: `${xPos + 24}px`,
      }}
    >
      <ul className={styles["context-content"]}>
        {characters.length > 0 ? (
          characters.map((character) => {
            return (
              <ContextMenuItem key={character._id} character={character} />
            );
          })
        ) : (
          <li>no characters</li>
        )}
      </ul>
    </div>
  );
}

function TargetBox({ targetStyle }) {
  return <div className={styles["target-box"]} style={targetStyle}></div>;
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
  const { charImage, characters, error, loading } = useGetImage();

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles["game-layout"]}>
      <div>{JSON.stringify(localCoords)}</div>
      <div>
        {JSON.stringify(
          getNormalizedPosition(960, 678.4, localCoords.x, localCoords.y)
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

        <img src={charImage.image_url} className={styles["image"]} />
      </div>
    </div>
  );
}
