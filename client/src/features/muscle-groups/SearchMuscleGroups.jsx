import { Input } from 'features/form/Input';
import React from 'react';
import { CreateMuscleGroup } from './CreateMuscleGroup';

export const SearchMuscleGroups = ({ query, setQuery }) => {
  return (
    <div className="sticky top-10 bg-white">
      <Input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        label="search"
        isRequired
        type="search"
        autoFocus
      />
      <div className="pb-2 w-full">
        <CreateMuscleGroup />
      </div>
    </div>
  );
};
