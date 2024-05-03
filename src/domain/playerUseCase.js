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
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
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

export const useUpdatePlayer = ({ playerId, end_time }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${playerUri}/${playerId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ end_time }),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        setPlayer(response.updatedPlayer);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { player, error, loading };
};

export const updatePlayer = async ({ playerId, end_time }) => {
  let player = null;
  let error = null;

  await fetch(`${playerUri}/${playerId}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
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
