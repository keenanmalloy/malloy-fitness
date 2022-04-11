import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { RiTimerFill } from 'react-icons/ri';
import WorkoutTimer from 'features/workout-header/WorkoutTimer';
import { useRouter } from 'next/router';

const WorkoutExerciseHeader = ({ workoutId }) => {
  const router = useRouter();
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (data && !data.workout) {
    return <p>none available...</p>;
  }

  const goBack = () => {
    router.push('/workouts');
  };

  return (
    <div className="flex w-auto h-8 justify-around border-b-4 border-black p-2">
      <div>
        <BiArrowBack onClick={goBack} />
      </div>
      <div>
        <h2>{data.workout.name}</h2>
      </div>
      <div className="flex">
        <RiTimerFill />
        <div>
          <WorkoutTimer
            endedAt={data.workout.ended_at}
            startedAt={data.workout.started_at}
            workoutId={workoutId}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutExerciseHeader;
