import React from 'react';
import { useFutureWorkoutsQuery } from 'features/workouts/useWorkoutsQuery';
import { Feed } from 'features/feed/Feed';

function HomePage() {
  const { data, isError, isLoading } = useFutureWorkoutsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workouts) {
    return <p>none available...</p>;
  }

  const getSingleWorkout = async (id) => {
    const res = await fetch(`http://localhost:4000/workouts/${id}`, {
      credentials: 'include',
    });
    const json = await res.json();
    return json;
  };

  const initializeWorkout = async (id) => {
    const res = await fetch(`http://localhost:4000/workouts/${id}/start`, {
      method: 'PATCH',
      credentials: 'include',
    });
    const json = await res.json();
    return json;
  };

  const startWorkout = async (workoutId) => {
    const workoutRes = await getSingleWorkout(workoutId);
    if (workoutRes.status !== 'success') {
      return;
    }
    const firstExercise = workoutRes.workout.exercises.sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    })[0];

    // GET /workouts/:pk and distinguish the first exercise within the workout
    // if success, continue
    // if error, show error in UI & do not run the following PATCH

    // PATCH /workouts/:pk/start
    // If successful
    // redirect to page localhost:3000/workouts/:pk/exercises/:pk
    // If error
    // show same error in UI as above
    const isStarted = workoutRes.workout.started_at;
    //isStarted not defined yet, need to return started_at from api
    if (isStarted) {
      return router.push(
        `/workouts/${workoutId}/exercises/${firstExercise.exercise_id}`
      );
    }
    const json = await initializeWorkout(workoutId);
    if (json.status !== 'success') {
      return;
    }
    router.push(
      `/workouts/${workoutId}/exercises/${firstExercise.exercise_id}`
    );
  };

  return (
    <div>
      <Profile />
      {/* These we can focus on later (was brainstorming), just need a list of any workouts for now. */}
      {/* 1. Today's Workout */}
      {/* 2. Users Created Workouts Feed*/}
      {/* 3. Default Workouts Feed (ones created by us)*/}
      {data.workouts.map((w) => {
        return (
          <div
            className="shadow-lg rounded-2xl w-80 p-4 bg-gray-800 mt-5"
            key={w.workout_id}
          >
            <div className="flex flex-row items-start gap-4">
              <div className="w-full flex flex-col justify-between">
                <div>
                  <p className="text-white text-xl font-medium">{w.name}</p>
                  <p className="text-gray-300 text-xs">{w.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-6">
              <Button
                type="button"
                className="w-full"
                onClick={() => startWorkout(w.workout_id)}
              >
                {w.started_at ? 'Continue' : 'Start'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HomePage;
