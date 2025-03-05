import { useState, useCallback } from "react";
import { Dog } from "../types";

export const useDogs = (itemsPerPage: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogObjs, setDogObjs] = useState<Dog[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch breeds");

      const data = await response.json();
      setBreeds(data);
      await getDogIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getDogIds = useCallback(
    async (breeds: string[] = [], lastIndex = "0", sort = "name:asc") => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append("size", `${itemsPerPage}`);
        params.append("from", lastIndex);
        params.append("sort", sort);
        breeds.forEach((key) => params.append("breeds", key));

        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?${params}`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch breeds");

        const data = await response.json();
        setCount(data.total);
        setDogIds(data.resultIds || []);
        await getDogObjs(data.resultIds || []);
      } catch (error) {
        setError("Failed to load dog IDs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  const getDogObjs = async (dogIds: string[]) => {
    try {
      setIsImagesLoading(true);
      const response = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dogIds),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch dogs");

      const data = await response.json();
      setDogObjs(data);

      setTimeout(() => setIsImagesLoading(false), 500);
    } catch (error) {
      setError("Failed to load dogs");
      console.error(error);
    }
  };

  const handleFindMatch = async (selectedDogs: Dog[]) => {
    try {
      setIsLoading(true);
      const dogIds = selectedDogs.map((dog) => dog.id);
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dogIds),
        }
      );

      if (!response.ok) throw new Error("Failed to find match");

      const data = await response.json();
      const matched = selectedDogs.find((dog) => dog.id === data.match);

      if (matched) {
        setMatchedDog(matched);
        return matched;
      }
    } catch (error) {
      setError("Failed to find match");
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    dogIds,
    dogObjs,
    count,
    error,
    isImagesLoading,
    matchedDog,
    breeds,
    fetchBreeds,
    getDogIds,
    getDogObjs,
    handleFindMatch,
  };
};
