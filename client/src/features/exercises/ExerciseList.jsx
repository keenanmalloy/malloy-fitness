import React from 'react';
import Link from 'next/link';

export const ExerciseList = ({ exercises }) => {
  return (
    <div>
      {exercises.map((exercise) => (
        <div
          className="flex flex-col text-center hover:bg-slate-200"
          key={exercise.exercise_id}
        >
          <hr />
          <Link href={`/exercises/${exercise.exercise_id}`}>
            <div>
              <h2 className="text-3xl font-bold">{exercise.name}</h2>
              <p>{exercise.category}</p>
              <p>{exercise.description}</p>
              <p>{exercise.movement}</p>
              <p>{exercise.range}</p>
              <p>{exercise.exercise_id}</p>

              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-blue-500 text-green-100 px-2 py-1 rounded-r-md">
                    Primary
                  </div>
                </div>
              </div>
              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-red-400 text-green-100 px-2 py-1 rounded-r-md">
                    Secondary
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
