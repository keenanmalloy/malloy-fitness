import { useQuery } from 'react-query';

const fetchSessionExercise = async ({ exerciseId, sessionId }) => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${sessionId}/exercises/${exerciseId}`,
    {
      credentials: 'include',
    }
  );

  // once we have the response, we need to turn it into JSON.
  const json = await res.json();

  // return the data that we got from the API.
  return json;
};

export const useSessionExerciseQuery = (exerciseId, sessionId) => {
  return useQuery(['fetchSessionExercise', exerciseId], () =>
    fetchSessionExercise({ exerciseId, sessionId })
  );
};
