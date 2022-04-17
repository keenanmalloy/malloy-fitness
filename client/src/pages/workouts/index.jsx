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
  const [activity, setActivity] = useState('');
  const [sortBy, setSortBy] = useState('');

  return (
    <Layout>
      <section className="p-5">
        <h1 className="pb-10">Workouts</h1>
        <div className="flex justify-end">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
          >
            {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <div className="sticky top-10 bg-white">
          <div className="py-2 w-full">
            {isFilterOpen && (
              <FilterWorkouts
                setCategory={setCategory}
                setType={setType}
                setActivity={setActivity}
                setSortBy={setSortBy}
              />
            )}

            <Button href="/workouts/create" className="w-full">
              Create workout
            </Button>
          </div>
        </div>

        <GetAllWorkouts
          category={category}
          type={type}
          activity={activity}
          sortBy={sortBy}
        />
      </section>
    </Layout>
  );
};

export default WorkoutsPage;
