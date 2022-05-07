import React from 'react';
import Select from 'react-select';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from 'features/environment';

interface Props {
  setCategory: (category: string) => void;
  setType: (type: string) => void;
  setView: (view: string) => void;
  setSortBy: (sortBy: string) => void;
}

export const FilterWorkouts = ({
  setCategory,
  setType,
  setView,
  setSortBy,
}: Props) => {
  return (
    <>
      <div className="flex flex-1 w-full">
        <div className="pb-2 flex-1 w-full">
          <label>Category</label>
          <Select
            onChange={(data) => setCategory(data?.value ?? '')}
            name="category"
            placeholder="Select"
            isSearchable={false}
            options={[{ label: 'all', value: '' }, ...WORKOUT_CATEGORIES]}
          />
        </div>
        <div className="pb-2 flex-1 w-full">
          <label>Type</label>
          <Select
            onChange={(data) => setType(data?.value ?? '')}
            name="type"
            placeholder="Select"
            isSearchable={false}
            options={[{ label: 'all', value: '' }, ...WORKOUT_TYPES]}
          />
        </div>
      </div>

      <div className="flex flex-1 w-full">
        <div className="pb-2 flex-1 w-full">
          <label>View</label>
          <Select
            onChange={(data) => setView(data?.value ?? '')}
            name="activity"
            placeholder="Select"
            isSearchable={false}
            options={[
              {
                label: 'all',
                value: '',
              },
              {
                label: 'public',
                value: 'public',
              },
              {
                label: 'private',
                value: 'private',
              },
            ]}
          />
        </div>
        <div className="pb-2 flex-1 w-full">
          <label>Sort By</label>
          <Select
            onChange={(data) => setSortBy(data?.value ?? '')}
            name="sortBy"
            placeholder="Select"
            isSearchable={false}
            options={[
              { label: 'default', value: '' },
              { label: 'created asc', value: 'created-asc' },
              { label: 'created desc', value: 'created-desc' },
              { label: 'updated asc', value: 'updated-asc' },
              { label: 'updated desc', value: 'updated-desc' },
            ]}
          />
        </div>
      </div>
    </>
  );
};
