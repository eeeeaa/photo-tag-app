import { useState } from "react";
import { useEffect } from "react";

const charImageUri = `${import.meta.env.VITE_PHOTO_TAG_API_URL}/char-images`;

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
