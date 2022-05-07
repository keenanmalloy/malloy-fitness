import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchPreviewWorkouts = async (date: string) => {
  const { data } = await apiClient.get(`/sessions/preview?date=${date}`);
  return data;
};

interface UsePreviewWorkoutsQueryParams {
  date: string;
  items: any[];
}

export const usePreviewWorkoutsQuery = ({
  date,
  items,
}: UsePreviewWorkoutsQueryParams) => {
  const filteredItem = items.filter(
    (item) =>
      item.month === new Date(date).getMonth() + 1 &&
      item.year === new Date(date).getFullYear() &&
      item.day === new Date(date).getDate()
  );

  const doesItemNotExist = !filteredItem.length;

  return useQuery(['fetchPreviewWorkouts', doesItemNotExist, items], () =>
    fetchPreviewWorkouts(date)
  );
};
