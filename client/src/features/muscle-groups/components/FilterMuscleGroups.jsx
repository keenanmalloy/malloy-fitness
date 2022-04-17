import React from 'react';
import Select from 'react-select';

export const FilterMuscleGroups = ({ setSortBy }) => {
  return (
    <>
      <div className="flex flex-1 w-full">
        <div className="pb-2 flex-1 w-full">
          <label>Sort By</label>
          <Select
            onChange={(data) => setSortBy(data.value)}
            name="sortBy"
            placeholder="Select"
            isSearchable={false}
            options={[
              { label: 'default', value: '' },
              { label: 'alphabetical A-Z', value: 'A-Z' },
              { label: 'alphabetical Z-A', value: 'Z-A' },
            ]}
          />
        </div>
      </div>
    </>
  );
};
