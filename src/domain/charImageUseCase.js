import { useState } from "react";
import { useEffect } from "react";

const charImageUri = `${import.meta.env.VITE_PHOTO_TAG_API_URL}/char-images`;

export const useGetFirstImage = () => {
  const [charImage, setCharImage] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  //get specific image for now
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
        setCharImage(response.charImages[0]);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { charImage, error, loading };
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

export const useGetImage = () => {
  const [characters, setCharacters] = useState([]);
  const [charImage, setCharImage] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  //get specific image for now
  useEffect(() => {
    Promise.all([
      fetch(`${charImageUri}/663238db21ca549577e2bac9`, {
        method: "GET",
        mode: "cors",
      }),
      fetch(`${charImageUri}/663238db21ca549577e2bac9/characters`, {
        method: "GET",
        mode: "cors",
      }),
    ])
      .then((responses) => {
        for (const response of responses) {
          if (response.status >= 400) {
            throw new Error("server error");
          }
        }
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((responses) => {
        setCharImage(responses[0].charImage);
        setCharacters(responses[1].characters);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { charImage, characters, error, loading };
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
