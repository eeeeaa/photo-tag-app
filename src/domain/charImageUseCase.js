import { useState } from "react";
import { useEffect } from "react";

const charImageUri = `${import.meta.env.VITE_PHOTO_TAG_API_URL}/char-images`;

export const useGetCharImages = () => {
  const [charImages, setCharImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${charImageUri}`, {
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
        setCharImages(response.charImages);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { charImages, error, loading };
};

export const useGetCharacters = (charImageId) => {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${charImageUri}/${charImageId}/characters`, {
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
        setCharacters(response.characters);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { characters, error, loading };
};

export const validatePosition = async ({ charImageId, char_x, char_y }) => {
  let character = null;
  let message = null;
  let error = null;

  await fetch(`${charImageUri}/${charImageId}/validate-position`, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ char_x, char_y }),
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then((response) => {
      if (response.character !== undefined) {
        character = response.character;
      }
      if (response.message !== undefined) {
        message = response.message;
      }
    })
    .catch((err) => (error = err));

  return { character, message, error };
};
