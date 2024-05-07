import { useState, useContext } from "react";
import { useGetCharImages } from "../../domain/charImageUseCase";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";

import { GameContext, AppContext } from "../../utils/contextProvider";

import { GameStart } from "../gameState/gameStart";

export default function Game() {
  const [markers, setMarkers] = useState([]);
  const { charImages, error, loading } = useGetCharImages();
  const { currentPlayer, setCurrentPlayer } = useContext(AppContext);

  const [charImage, setCharImage] = useState({});
  const [gameState, setGameState] = useState(<GameStart />);
  const [gameMode, setGameMode] = useState("REAL");

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <GameContext.Provider
      value={{
        charImages,
        charImage,
        setCharImage,
        gameState,
        setGameState,
        markers,
        setMarkers,
        currentPlayer,
        setCurrentPlayer,
        gameMode,
        setGameMode,
      }}
    >
      {gameState}
    </GameContext.Provider>
  );
}
