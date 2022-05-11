import React, { useState } from 'react';
import { GetAllWorkouts } from 'features/workouts/components/GetAllWorkouts';
import Layout from 'features/common/Layout';
import { Button } from 'features/common/Button';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FilterWorkouts } from 'features/workouts/components/FilterWorkouts';

const WorkoutsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [view, setView] = useState('');
  const [sortBy, setSortBy] = useState('');

  return (
    <Layout>
      <section>
        <div className="sticky top-11 bg-white z-10 p-2">
          <div className="flex justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
            >
              {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <h1 className="">Workouts</h1>
          </div>
          <div className="py-2 w-full">
            {isFilterOpen && (
              <FilterWorkouts
                setCategory={setCategory}
                setType={setType}
                setView={setView}
                setSortBy={setSortBy}
              />
            )}

            <Button href="/workouts/create" className="w-full">
              Create workout
            </Button>
          </div>
        </div>

        <div className="p-3">
          <GetAllWorkouts
            category={category}
            type={type}
            view={view}
            sortBy={sortBy}
          />
        </div>
      </section>
    </Layout>
  );
};

export default WorkoutsPage;
