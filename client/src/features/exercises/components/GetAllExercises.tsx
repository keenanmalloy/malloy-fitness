import React, { useState } from 'react';
import { ExerciseList } from 'features/exercises/components/ExerciseList';
import { Input } from 'features/form/Input';
import { CreateExercise } from 'features/exercises/components/CreateExercise';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FilterExercises } from './FilterExercises';

export const GetAllExercises = () => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [view, setView] = useState('');
  const [profile, setProfile] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <section className="p-5">
      <h1 className="pb-10">Exercises</h1>

      <div className="sticky top-10 bg-slate-900 z-50">
        <div className="flex justify-start">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
          >
            {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <div className="pt-2 w-full">
          {isFilterOpen && (
            <FilterExercises
              setSortBy={setSortBy}
              setCategory={setCategory}
              setView={setView}
              setProfile={setProfile}
            />
          )}
        </div>
        <Input
          onChange={handleQuery}
          value={query}
          label="search"
          isRequired
          type="search"
        />
        <div className="pb-2 w-full">
          <CreateExercise />
        </div>
      </div>
      <ExerciseList
        query={query}
        category={category}
        view={view}
        profile={profile}
        sortBy={sortBy}
      />
    </section>
  );
};
