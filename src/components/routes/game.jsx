import styles from "../../styles/routes/game.module.css";
import useMousePosition from "../../utils/mouseUtils";
import { useEffect, useState } from "react";
import { getNormalizedPosition } from "../../utils/imageUtils";

function ContextMenu({ showMenu, xPos, yPos }) {
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
        <li className={styles["context-item"]}>Menu 1</li>
        <li className={styles["context-item"]}>Menu 2</li>
        <li className={styles["context-item"]}>Menu 3</li>
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

  return (
    <div className={styles["game-layout"]}>
      <div>{JSON.stringify(localCoords)}</div>
      <div>
        {JSON.stringify(
          getNormalizedPosition(500, 500, localCoords.x, localCoords.y)
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
        />
        <TargetBox targetStyle={targetStyle} />
      </div>
    </div>
  );
}
