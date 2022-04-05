import React, { useState, useEffect } from 'react';
import { ExerciseList } from './ExerciseList';
import { Input } from 'features/form/Input';
import { CreateExercise } from './CreateExercise';

export const GetAllExercises = () => {
  const [query, setQuery] = useState('');

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <section>
      <div className="sticky top-10 bg-white">
        <Input
          onChange={handleQuery}
          value={query}
          label="search"
          isRequired
          type="search"
          autoFocus
        />
        <div className="pb-2 w-full">
          <CreateExercise />
        </div>
      </div>
      <ExerciseList query={query} />
    </section>
  );
};
