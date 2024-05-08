import styles from "../../styles/routes/game.module.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../../utils/contextProvider";
import { createPlayer } from "../../domain/playerUseCase";
import { Toast } from "../common/toast";
import PropTypes from "prop-types";
import ErrorPage from "../common/error";

import { ActiveGame } from "./gameActive";

CharImageItem.propTypes = {
  charImage: PropTypes.object,
  handleSelectImage: PropTypes.func,
};

function CharImageItem({ charImage, selectedChar, handleSelectImage }) {
  if (selectedChar._id === charImage._id) {
    return (
      <div
        className={`${styles["char-image-item"]} ${styles["selected"]}`}
        onClick={() => handleSelectImage(charImage)}
      >
        <img
          className={styles["char-image-content"]}
          src={charImage.image_url}
          alt={charImage._id}
        />
      </div>
    );
  }
  return (
    <div
      className={styles["char-image-item"]}
      onClick={() => handleSelectImage(charImage)}
    >
      <img
        className={styles["char-image-content"]}
        src={charImage.image_url}
        alt={charImage._id}
      />
    </div>
  );
}

export function GameStart() {
  const {
    charImages,
    setGameState,
    setCurrentPlayer,
    setGameMode,
    setCharImage,
    charImage,
  } = useContext(GameContext);
  const [name, setName] = useState("player");
  const [toastMsg, setToastMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { player, error } = await createPlayer({ player_name: name });
      if (error != null) {
        setGameState(<ErrorPage errorMsg={error.message} />);
        return;
      }
      setGameMode("REAL");
      setGameState(<ActiveGame />);
      setCurrentPlayer(player);
    } catch (error) {
      navigate("/error");
    }
  };
  const handlePracticeClick = () => {
    setGameMode("PRACTICE");
    setGameState(<ActiveGame />);
  };

  const handleSelectImage = (charImage) => {
    setCharImage(charImage);
    setToastMsg("Game selected");
  };

  useEffect(() => {
    if (charImages.length > 0) {
      setCharImage(charImages[0]);
    }
  }, [charImages, setCharImage]);

  return (
    <div className={styles["game-layout"]}>
      {toastMsg.length > 0 ? (
        <Toast
          message={toastMsg}
          setToastMsg={setToastMsg}
          isErrorStyle={false}
        />
      ) : (
        <></>
      )}
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
        <button onClick={handlePracticeClick}>Practice</button>
      </div>
      <div className={styles["char-image-list"]}>
        {charImages.length > 0 ? (
          charImages.map((item) => {
            return (
              <CharImageItem
                key={item._id}
                charImage={item}
                selectedChar={charImage}
                handleSelectImage={handleSelectImage}
              />
            );
          })
        ) : (
          <div>No games</div>
        )}
      </div>
    </div>
  );
}
