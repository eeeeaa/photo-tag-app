import styles from "../../styles/routes/game.module.css";
import { useContext } from "react";
import { GameContext } from "../../utils/contextProvider";
import { useUpdatePlayer } from "../../domain/playerUseCase";
import { calculateTimeSpent } from "../../utils/dateUtils";

import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";

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

export function PracticeEnd() {
  return (
    <div className={styles["game-layout"]}>
      <h2>Practice finished</h2>
    </div>
  );
}
