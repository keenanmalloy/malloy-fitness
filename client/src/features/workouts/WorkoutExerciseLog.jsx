import React from 'react';
import WorkoutExerciseLogRow from './WorkoutExerciseLogRow';

const WorkoutExerciseLog = () => {
  return (
    <div>
      <div className="flex justify-evenly">
        <p>Reps</p>
        <p>Weight (LBS)</p>
      </div>
      <ul className="py-1">
        <li className="py-1">
          <WorkoutExerciseLogRow setNumber="01" repNumber="10-12" />
        </li>
        <li className="py-1">
          <WorkoutExerciseLogRow setNumber="02" repNumber="10-12" />
        </li>
        <li className="py-1">
          <WorkoutExerciseLogRow setNumber="03" repNumber="10-12" />
        </li>
      </ul>
    </div>
  );
};

export default WorkoutExerciseLog;
