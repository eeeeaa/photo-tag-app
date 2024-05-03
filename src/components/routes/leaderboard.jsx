import { useGetPlayers } from "../../domain/playerUseCase";
import ErrorPage from "../common/error";
import LoadingPage from "../common/loading";
import { calculateTimeSpent } from "../../utils/dateUtils";
import PropTypes from "prop-types";
import styles from "../../styles/routes/leaderboard.module.css";

PlayerItem.propTypes = {
  player: PropTypes.object,
};

function PlayerItem({ player }) {
  return (
    <li className={styles["player-item"]}>
      <div className={styles["player-name"]}>Name: {player.player_name}</div>
      <div className={styles["time-spent"]}>
        Time Spent: {calculateTimeSpent(player.start_time, player.end_time)}
      </div>
    </li>
  );
}

export default function Leaderboard() {
  const { players, error, loading } = useGetPlayers();

  if (error) return <ErrorPage errorMsg={error.message} />;
  if (loading) return <LoadingPage />;

  return (
    <div className={styles["leaderboard-layout"]}>
      <ul className={styles["player-list"]}>
        {players.length > 0 ? (
          players.map((player) => {
            return <PlayerItem key={player._id} player={player} />;
          })
        ) : (
          <div>No players</div>
        )}
      </ul>
    </div>
  );
}
