import { useQuery } from 'react-query';

const fetchAccount = async () => {
  try {
    // fetch the data, the fetch call returns a promise of a response.
    // we await for the promise to resolve with the await keyword.
    const res = await fetch(`http://localhost:4000/auth/me`, {
      credentials: 'include',
    });

    // once we have the response, we need to turn it into JSON.
    const json = await res.json();

    // return the data that we got from the API.
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const useAccountQuery = () => {
  return useQuery('fetchAccount', fetchAccount);
};
