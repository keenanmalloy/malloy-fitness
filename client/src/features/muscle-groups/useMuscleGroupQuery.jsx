import { useQuery } from "react-query";

const fetchMuscleGroups = async () => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const res = await fetch("http://localhost:4000/muscle-groups/", {
    credentials: "include",
  });

  // once we have the response, we need to turn it into JSON.
  const json = await res.json();

  // return the data that we got from the API.
  return json;
};

export const useMuscleGroupQuery = () => {
  // useQuery takes 2 arguments,
  // 1. a query key that is named as whatever we'd like (eg. "fetchMuscleGroups")
  // 2. a function that fetches the data (eg. defined above)
  return useQuery("fetchMuscleGroups", fetchMuscleGroups);
};

// we the use this function in the MuscleGroups.jsx component.
