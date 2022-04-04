import { useMutation } from 'react-query';

const updateField = async (payload) => {
  try {
    // fetch the data, the fetch call returns a promise of a response.
    // we await for the promise to resolve with the await keyword.
    const res = await fetch(`http://localhost:4000/auth/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // once we have the response, we need to turn it into JSON.
    const json = await res.json();

    // return the data that we got from the API.
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const useAccountFieldMutation = () => {
  return useMutation(({ payload }) => updateField(payload));
};
