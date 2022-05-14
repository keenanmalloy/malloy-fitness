import React, { useState } from 'react';
import { GetAllWorkouts } from 'features/workouts/components/GetAllWorkouts';
import Layout from 'features/common/Layout';
import { Button } from 'features/common/Button';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FilterWorkouts } from 'features/workouts/components/FilterWorkouts';
import FullPageModal from 'features/modal/FullPageModal';
import { CreateWorkout } from 'features/workout-creation/CreateWorkout';
import { BiX } from 'react-icons/bi';

const WorkoutsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [view, setView] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [isOpen, setIsOpen] = useState(false);

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

            <Button className="w-full" onClick={() => setIsOpen(true)}>
              Create workout
            </Button>

            <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
              <button
                className="right-0 top-0 p-3 absolute"
                onClick={() => setIsOpen(false)}
              >
                <BiX size={24} />
              </button>
              <CreateWorkout setIsOpen={setIsOpen} />
            </FullPageModal>
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
