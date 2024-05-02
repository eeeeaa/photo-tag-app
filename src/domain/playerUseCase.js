import { useState } from "react";
import { useEffect } from "react";

const playerUri = `${import.meta.env.VITE_PHOTO_TAG_API_URL}/players`;

export const useGetPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${playerUri}`, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        setPlayers(response.players);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { players, error, loading };
};

export const createPlayer = async ({ player_name }) => {
  let player = null;
  let error = null;

  await fetch(`${playerUri}`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ player_name }),
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then((response) => {
      player = response.player;
    })
    .catch((err) => (error = err));

  return { player, error };
};

export const updatePlayer = async ({ end_time }) => {
  let player = null;
  let error = null;

  await fetch(`${playerUri}`, {
    method: "PUT",
    mode: "cors",
    body: JSON.stringify({ end_time }),
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then((response) => {
      player = response.updatedPlayer;
    })
    .catch((err) => (error = err));

  return { player, error };
};
