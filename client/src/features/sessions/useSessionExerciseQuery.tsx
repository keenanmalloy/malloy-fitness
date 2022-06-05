import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';
import { z } from 'zod';

const taskSchema = z.object({
  message: z.string(),
  status: z.string(),
  exerciseIds: z.array(z.string()),
  task: z.array(
    z.object({
      exercise_id: z.string(),
      name: z.string(),
      description: z.nullable(z.string()),
      category: z.string(),
      view: z.string(),
      video: z.nullable(z.string()),
      profile: z.string(),
      task_order: z.array(z.string()),
      workout_id: z.string(),
      exercise_order: z.nullable(z.array(z.string())),
      workout_task_id: z.string(),
      workout_task_exercise_id: z.string(),
    })
  ),
  record: z.nullable(z.string()),
  next: z.object({
    order: z.object({
      workoutTaskId: z.nullable(z.string()).optional(),
    }),
  }),
  prev: z.object({
    order: z.object({
      workoutTaskId: z.nullable(z.string()).optional(),
    }),
  }),
});

export type TaskSchema = z.infer<typeof taskSchema>;

interface FetchSessionTaskParams {
  workoutTaskId: string;
  sessionId: string;
}

const fetchSessionTask = async ({
  workoutTaskId,
  sessionId,
}: FetchSessionTaskParams) => {
  const { data } = await apiClient.get(
    `/sessions/${sessionId}/tasks/${workoutTaskId}`
  );

  const result = taskSchema.parse(data);
  return result;
};

export const useSessionExerciseQuery = (
  workoutTaskId: string,
  sessionId: string
) => {
  return useQuery<TaskSchema>(['fetchSessionTask', workoutTaskId], () =>
    fetchSessionTask({ workoutTaskId, sessionId })
  );
};
