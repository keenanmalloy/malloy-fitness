import React from 'react';

const WorkoutExerciseLogRow = ({ setNumber, repNumber }) => {
  return (
    <div className="flex">
      <div>
        Set <span className="flex">{setNumber}</span>
      </div>
      <input
        type="number"
        placeholder={repNumber}
        className="flex text-center"
      />
      <input
        type="number"
        placeholder="Weight (LBS)"
        className="flex text-center"
      />
    </div>
  );
};

export default WorkoutExerciseLogRow;
