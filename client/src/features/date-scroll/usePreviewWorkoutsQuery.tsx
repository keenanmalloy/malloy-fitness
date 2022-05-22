import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const getPreviewWorkoutsSchema = z.object({
  status: z.string(),
  message: z.string(),
  sessions: z.array(
    z.object({
      session_id: z.string(),
      session_dt: z.string(),
      type: z.string(),
    })
  ),
});

export type GetPreviewWorkoutsSchema = z.infer<typeof getPreviewWorkoutsSchema>;

const fetchPreviewWorkouts = async (date: string) => {
  const { data } = await apiClient.get(`/sessions/preview?date=${date}`);
  const result = getPreviewWorkoutsSchema.parse(data);
  return result;
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

  return useQuery<GetPreviewWorkoutsSchema>(
    ['fetchPreviewWorkouts', doesItemNotExist, items],
    () => fetchPreviewWorkouts(date)
  );
};
