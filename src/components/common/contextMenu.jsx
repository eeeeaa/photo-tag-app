import { useContext } from "react";
import { getNormalizedPosition } from "../../utils/imageUtils";
import { validatePosition } from "../../domain/charImageUseCase";
import PropTypes from "prop-types";
import { GameContext } from "../../utils/contextProvider";
import styles from "../../styles/common/contextMenu.module.css";
import { useNavigate } from "react-router-dom";

ContextMenuItem.propTypes = {
  character: PropTypes.object,
  xPos: PropTypes.number,
  yPos: PropTypes.number,
};

ContextMenu.propTypes = {
  showMenu: PropTypes.bool,
  xPos: PropTypes.number,
  yPos: PropTypes.number,
  characters: PropTypes.array,
};

function ContextMenuItem({ character, xPos, yPos }) {
  const navigate = useNavigate();
  const { showToast, placeMarker, WIDTH_PX, HEIGHT_PX } =
    useContext(GameContext);
  const handleMenuClick = async () => {
    const { normalX, normalY } = getNormalizedPosition(
      WIDTH_PX,
      HEIGHT_PX,
      xPos,
      yPos
    );

    const { character, message, error } = await validatePosition({
      char_x: normalX,
      char_y: normalY,
    });
    if (error != null) {
      navigate("/error");
      return;
    }
    if (character != null) {
      placeMarker(xPos, yPos);
    } else if (message != null) {
      showToast(message);
    }
  };
  return (
    <li className={styles["context-item"]} onClick={handleMenuClick}>
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

export function ContextMenu({ showMenu, xPos, yPos, characters }) {
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
              <ContextMenuItem
                key={character._id}
                character={character}
                xPos={xPos}
                yPos={yPos}
              />
            );
          })
        ) : (
          <li>no characters</li>
        )}
      </ul>
    </div>
  );
}
