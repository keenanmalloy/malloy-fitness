import { useQuery } from 'react-query';

const fetchExercises = async (query) => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/exercises/?q=${query ?? ''}`,
    {
      credentials: 'include',
    }
  );

  // once we have the response, we need to turn it into JSON.
  const json = await res.json();

  // return the data that we got from the API.
  return json;
};

export const useExercisesQuery = (query) => {
  return useQuery(['fetchExercises', query], () => fetchExercises(query));
};
