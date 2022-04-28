import React from 'react';
import { useExerciseQuery } from 'features/exercises/api/useExerciseQuery';
import { UpdateExercise } from 'features/exercises/components/UpdateExercise';
import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';
import { Skeleton } from 'features/common/Skeleton';
import Link from 'next/link';
import Upload from 'features/Upload';
import { useUpdateExerciseMutation } from '../api/useUpdateExerciseMutation';
import { useQueryClient } from 'react-query';
import { GetRelatedExercises } from './GetRelatedExercises';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useRouter } from 'next/router';

export const GetSingleExercise = ({ id }) => {
  const { data, isError, isLoading } = useExerciseQuery(id);
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: mgData,
    isError: mgIsError,
    isLoading: mgIsLoading,
  } = useMuscleGroupsQuery();

  const {
    isLoading: mLoading,
    mutate,
    isError: mIsError,
  } = useUpdateExerciseMutation(id);

  if (isLoading || mgIsLoading) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32 rounded-sm" />
          <Skeleton className="h-8 w-10 rounded-sm" />
        </div>

        <Skeleton className="h-44 w-full mt-5" />
        <Skeleton className="h-5 w-full mt-5" />
        <Skeleton className="h-3 w-full mt-2" />
      </div>
    );
  }

  if (isError || mgIsError) {
    return (
      <div className="p-5">
        <p style={{ color: 'red' }}>fetching error...</p>
      </div>
    );
  }

  if (data && !data.exercise) {
    return (
      <div className="p-5">
        <p>does not exist...</p>
      </div>
    );
  }

  return (
    <section className="p-5 relative">
      <header className="flex justify-between">
        <button
          className="bg-white  text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32"
          onClick={() => router.back()}
        >
          Back
        </button>
        {(data.role === 'developer' || data.exercise.view === 'private') && (
          <UpdateExercise
            exercise={data.exercise}
            muscleGroups={mgData.muscleGroups}
            queryKey="fetchExercise"
          />
        )}
      </header>

      <main className="pt-5">
        <div className="flex justify-between">
          <h1 className="text-2xl pr-2 pb-2">{data.exercise.name}</h1>
          <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-8">
            {data.exercise.category ?? 'other'}
          </span>
        </div>
        <p>{data.exercise.description}</p>

        {!!data.exercise.video && (
          <div className="py-5">
            <video
              controls
              className="w-full"
              src={`https://cdn.trckd.ca/${data.exercise.video}`}
            />
          </div>
        )}

        {(data.role === 'developer' || data.exercise.view === 'private') && (
          <div className="pt-5">
            <Upload
              title="Upload a video"
              accepts="video/*"
              onChange={(url) => {
                mutate(
                  {
                    exercise: {
                      video: url,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.refetchQueries('fetchExercise');
                    },
                  }
                );
              }}
              hidePreview
            />
          </div>
        )}

        {(data.exercise.primary_tracker === 'weight' ||
          data.exercise.secondary_tracker === 'weight') && (
          <div className="mt-5">
            <h2 className="text-lg">Profile</h2>

            <div className="relative flex justify-between py-5">
              <div>
                <div
                  className={`p-2 ${
                    data.exercise.profile?.toLowerCase() === 'short'
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  } rounded-full w-5 h-5 z-10`}
                />
                <p className="pt-2 text-xs">Short</p>
              </div>

              <div>
                <div
                  className={`p-2 ${
                    data.exercise.profile?.toLowerCase() === 'mid'
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  } rounded-full w-5 h-5 z-10`}
                />
                <p className="pt-2 text-xs">Mid</p>
              </div>

              <div>
                <div
                  className={`p-2 ${
                    data.exercise.profile?.toLowerCase() === 'long'
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  } rounded-full w-5 h-5 z-10`}
                />
                <p className="pt-2 text-xs">Long</p>
              </div>

              <div className="absolute top-7 right-4 left-4 border-2 h-0.5 bg-black -z-50"></div>
            </div>
          </div>
        )}

        <div className="py-5">
          <h2 className="py-3 text-lg underline">Muscle Groups</h2>
          <ul className="pl-5 flex-col space-y-1">
            <h3 className="py-3 text-sm underline capitalize">primary</h3>
            {!data.exercise.primary.length && (
              <li className="border-solid py-4 bg-gray-50 flex justify-between px-3 rounded-sm">
                <p>None</p>
              </li>
            )}
            {data.exercise.primary.map((group) => (
              <Link
                href={`/muscle-groups/${group.muscle_group_id}`}
                as={`/muscle-groups/${group.muscle_group_id}`}
                key={group.muscle_group_id}
              >
                <li className="border-solid py-4 bg-gray-50 flex justify-between px-3 rounded-sm">
                  <p>{group.name}</p>
                  <IoIosArrowRoundForward />
                </li>
              </Link>
            ))}
          </ul>

          <ul className="pl-5 flex-col space-y-1">
            <h3 className="py-3 text-sm underline capitalize">secondary</h3>
            {!data.exercise.secondary.length && (
              <li className="border-solid py-4 bg-gray-50 flex justify-between px-3 rounded-sm">
                <p>None</p>
              </li>
            )}
            {data.exercise.secondary.map((group) => (
              <Link
                href={`/muscle-groups/${group.muscle_group_id}`}
                as={`/muscle-groups/${group.muscle_group_id}`}
                key={group.muscle_group_id}
              >
                <li className="border-solid py-4 bg-gray-50 flex justify-between px-3 rounded-sm">
                  <p>{group.name}</p>
                  <IoIosArrowRoundForward />
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <GetRelatedExercises
          type={data.exercise.type}
          profile={data.exercise.profile}
          category={data.exercise.category}
          exerciseId={data.exercise.exercise_id}
          muscleGroupIds={[
            ...data.exercise.secondary.map((mg) => mg.muscle_group_id),
            ...data.exercise.primary.map((mg) => mg.muscle_group_id),
          ]}
        />
      </main>
    </section>
  );
};
