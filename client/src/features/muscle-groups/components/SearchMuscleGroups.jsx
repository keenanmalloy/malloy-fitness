import { Input } from 'features/form/Input';
import React from 'react';
import { CreateMuscleGroup } from 'features/muscle-groups/components/CreateMuscleGroup';

export const SearchMuscleGroups = ({ query, setQuery, role }) => {
  return (
    <div className="sticky top-10 bg-white">
      <Input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        label="search"
        isRequired
        type="search"
      />
      {role === 'developer' && (
        <div className="pb-2 w-full">
          <CreateMuscleGroup />
        </div>
      )}
    </div>
  );
};
