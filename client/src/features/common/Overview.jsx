import React from 'react';
import { DietPanel } from 'features/diet/DietPanel';
import { TrainingPanel } from 'features/training/TrainingPanel';
import { useDailyOverviewQuery } from 'features/common/useDailyOverviewQuery';

export const Overview = ({ selected }) => {
  const { data, isError, isLoading } = useDailyOverviewQuery(
    new Date(
      new Intl.DateTimeFormat('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(
        selected.id
          ? new Date(selected.year, selected.month - 1, selected.day)
          : new Date()
      )
    ).toISOString()
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <DietPanel />
      <TrainingPanel data={data} />
      <div className="h-40 flex justify-center"></div>
      <div className="flex justify-center mx-3 pb-4">
        <div className="flex flex-col text-center text-slate-600">
          Google fit data
        </div>
      </div>
    </div>
  );
};
