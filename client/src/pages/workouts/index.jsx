import React, { useState } from 'react';
import { GetAllWorkouts } from 'features/workouts/components/GetAllWorkouts';
import Layout from 'features/common/Layout';
import { Button } from 'features/common/Button';
import Select from 'react-select';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from 'features/environment';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

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
              <>
                <div className="flex flex-1 w-full">
                  <div className="pb-2 flex-1 w-full">
                    <label>Category</label>
                    <Select
                      onChange={(data) => setCategory(data.value)}
                      name="category"
                      placeholder="Select"
                      isSearchable={false}
                      options={[
                        { label: 'all', value: '' },
                        ...WORKOUT_CATEGORIES,
                      ]}
                    />
                  </div>
                  <div className="pb-2 flex-1 w-full">
                    <label>Type</label>
                    <Select
                      onChange={(data) => setType(data.value)}
                      name="type"
                      placeholder="Select"
                      isSearchable={false}
                      options={[{ label: 'all', value: '' }, ...WORKOUT_TYPES]}
                    />
                  </div>
                </div>

                <div className="flex flex-1 w-full">
                  <div className="pb-2 flex-1 w-full">
                    <label>Activity</label>
                    <Select
                      onChange={(data) => setActivity(data.value)}
                      name="activity"
                      placeholder="Select"
                      isSearchable={false}
                      options={[
                        {
                          label: 'all',
                          value: '',
                        },
                        {
                          label: 'in-progress',
                          value: 'in-progress',
                        },
                        {
                          label: 'completed',
                          value: 'completed',
                        },
                        {
                          label: 'scheduled',
                          value: 'scheduled',
                        },
                        {
                          label: 'default',
                          value: 'default',
                        },
                      ]}
                    />
                  </div>
                  <div className="pb-2 flex-1 w-full">
                    <label>Sort By</label>
                    <Select
                      onChange={(data) => setSortBy(data.value)}
                      name="sortBy"
                      placeholder="Select"
                      isSearchable={false}
                      options={[
                        { label: 'default', value: '' },
                        { label: 'created asc', value: 'created-asc' },
                        { label: 'created desc', value: 'created-desc' },
                        { label: 'started asc', value: 'started-asc' },
                        { label: 'started desc', value: 'started-desc' },
                        { label: 'updated asc', value: 'updated-asc' },
                        { label: 'updated desc', value: 'updated-desc' },
                        { label: 'scheduled asc', value: 'scheduled-asc' },
                        { label: 'scheduled desc', value: 'scheduled-desc' },
                      ]}
                    />
                  </div>
                </div>
              </>
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
