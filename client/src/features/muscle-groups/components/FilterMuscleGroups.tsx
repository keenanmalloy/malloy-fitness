import { selectStyles } from 'features/common/selectStyles';
import React from 'react';
import Select from 'react-select';

interface Props {
  setSortBy: (value: string) => void;
}

export const FilterMuscleGroups = ({ setSortBy }: Props) => {
  return (
    <>
      <div className="flex flex-1 w-full">
        <div className="pb-2 flex-1 w-full">
          <label>Sort By</label>
          <Select
            onChange={(data) => setSortBy(data?.value ?? '')}
            name="sortBy"
            placeholder="Select"
            isSearchable={false}
            options={[
              { label: 'default', value: '' },
              { label: 'alphabetical A-Z', value: 'A-Z' },
              { label: 'alphabetical Z-A', value: 'Z-A' },
            ]}
            styles={selectStyles}
          />
        </div>
      </div>
    </>
  );
};
