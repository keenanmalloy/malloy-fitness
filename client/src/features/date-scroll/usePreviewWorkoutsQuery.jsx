import { useQuery } from 'react-query';

const fetchPreviewWorkouts = async ({ date }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/preview?date=${date}`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const usePreviewWorkoutsQuery = ({ date, items }) => {
  const filteredItem = items.filter(
    (item) =>
      item.month === new Date(date).getMonth() + 1 &&
      item.year === new Date(date).getFullYear() &&
      item.day === new Date(date).getDate()
  );

  const doesItemNotExist = !filteredItem.length;

  return useQuery(['fetchPreviewWorkouts', doesItemNotExist, items], () =>
    fetchPreviewWorkouts({ date })
  );
};
