import { useContext } from "react";
import { validatePosition } from "../../domain/charImageUseCase";
import PropTypes from "prop-types";
import { GameContext, MenuContext } from "../../utils/contextProvider";
import styles from "../../styles/common/contextMenu.module.css";
import { useNavigate } from "react-router-dom";
import { GameEnd } from "../routes/game";

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

TargetBox.propTypes = {
  targetStyle: PropTypes.object,
};

export function TargetBox({ targetStyle }) {
  return <div className={styles["target-box"]} style={targetStyle}></div>;
}

function ContextMenuItem({ character }) {
  const navigate = useNavigate();
  const { markers, setMarkers, setGameState, charImage } =
    useContext(GameContext);
  const { toastMsg, setToastMsg, characters, normalX, normalY } =
    useContext(MenuContext);

  const checkGameEnd = (currentMarkers) => {
    if (currentMarkers.length >= characters.length) {
      setGameState(<GameEnd />);
    }
  };

  const showToast = (message) => {
    if (toastMsg.length === 0) {
      setToastMsg(message);
    }
  };
  const placeMarker = () => {
    let newMarkers = [...markers];
    if (!markers.includes({ normalX, normalY })) {
      newMarkers.push({ normalX, normalY });
    }
    setMarkers(newMarkers);
    checkGameEnd(newMarkers);
  };

  const handleMenuClick = async () => {
    const { character, message, error } = await validatePosition({
      charImageId: charImage._id,
      char_x: normalX,
      char_y: normalY,
    });
    if (error != null) {
      navigate("/error");
      return;
    }
    if (character != null) {
      placeMarker();
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

export function ContextMenu({ showMenu }) {
  const { characters, posX, posY } = useContext(MenuContext);
  if (!showMenu) return null;
  return (
    <div
      className={styles["context-menu"]}
      style={{
        top: `${posY}px`,
        left: `${posX + 24}px`,
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
