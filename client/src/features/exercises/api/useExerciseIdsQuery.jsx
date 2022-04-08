import { useQuery } from 'react-query';

const fetchExercises = async (ids) => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const res = await fetch(
    `http://localhost:4000/exercises/?ids=${ids.join(',')}`,
    {
      credentials: 'include',
    }
  );

  // once we have the response, we need to turn it into JSON.
  const json = await res.json();

  // return the data that we got from the API.
  return json;
};

export const useExerciseIdsQuery = (ids) => {
  return useQuery(['fetchExerciseByIds', ids], () => fetchExercises(ids), {
    enabled: !!ids.length,
  });
};
