import React from 'react';
import Select from 'react-select';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from 'features/environment';

export const FilterWorkouts = ({
  setCategory,
  setType,
  setActivity,
  setSortBy,
}) => {
  return (
    <>
      <div className="flex flex-1 w-full">
        <div className="pb-2 flex-1 w-full">
          <label>Category</label>
          <Select
            onChange={(data) => setCategory(data.value)}
            name="category"
            placeholder="Select"
            isSearchable={false}
            options={[{ label: 'all', value: '' }, ...WORKOUT_CATEGORIES]}
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
  );
};
