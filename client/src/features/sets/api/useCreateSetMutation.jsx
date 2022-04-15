import { useMutation } from 'react-query';

const createSet = async ({ set }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(set),
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useCreateSetMutation = () => {
  return useMutation(createSet);
};
