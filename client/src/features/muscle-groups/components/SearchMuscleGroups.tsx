import { Input } from 'features/form/Input';
import React, { useState } from 'react';
import { CreateMuscleGroup } from 'features/muscle-groups/components/CreateMuscleGroup';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FilterMuscleGroups } from './FilterMuscleGroups';

interface Props {
  query: string;
  setQuery: (s: string) => void;
  setSortBy: (s: string) => void;
  role?: string;
}

export const SearchMuscleGroups = ({
  query,
  setQuery,
  setSortBy,
  role,
}: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div className="sticky top-10 bg-slate-900">
        <div className="flex justify-start">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
          >
            {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <div className="pt-2 w-full">
          {isFilterOpen && <FilterMuscleGroups setSortBy={setSortBy} />}
        </div>

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
    </>
  );
};
