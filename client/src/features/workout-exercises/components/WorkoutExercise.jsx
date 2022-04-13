import React, { useState } from 'react';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import WorkoutExerciseLog from './WorkoutExerciseLog';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import Modal from 'features/common/Modal';
import { Input } from 'features/form/Input';

export const WorkoutExercise = ({
  workoutId,
  exerciseId,
  nextEx,
  prevEx,
  exercise,
}) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);
  const [repetitions, setRepetitions] = useState(0);
  const [weight, setWeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const router = useRouter();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workout) {
    return <p>none available...</p>;
  }

  const finishWorkout = () => {
    router.push(`/workouts/${workoutId}/end`);
  };

  const handleNotes = () => {};

  return (
    <div>
      <OverviewRow
        order="A1"
        name={exercise.name}
        sets="sets 3"
        reps="reps 10-12"
        rir="rir 1"
        rest="REST 90 seconds"
      />
      <div className="box-border h-32 text-center w-auto">
        {data.workout.exercises[0].video}
      </div>
      <GetExerciseSets workoutId={workoutId} exerciseId={exerciseId} />
      <WorkoutExerciseLog workoutId={workoutId} exerciseId={exerciseId} />
      <div className="flex justify-around">
        <Button onClick={() => setIsOpen(!isOpen)}>Notes</Button>
        <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
          <Input
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
            placeholder="Add all your notes here: execution, setup, goals, ideas etc."
            isTextArea
          />
        </Modal>
      </div>
      <div className="flex justify-center py-1">
        <Button
          onClick={
            prevEx.order !== null
              ? () =>
                  router.push(
                    `/workouts/${workoutId}/exercises/${prevEx.order.exercise_id}`
                  )
              : null
          }
        >
          Previous Exercise
        </Button>
        <Button
          onClick={
            nextEx.order !== null
              ? () =>
                  router.push(
                    `/workouts/${workoutId}/exercises/${nextEx.order.exercise_id}`
                  )
              : finishWorkout
          }
        >
          {nextEx.order === null ? 'Finish Workout' : 'Next Exercise'}
        </Button>
      </div>
    </div>
  );
};
