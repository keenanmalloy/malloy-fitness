import React from 'react';
import { useDailyOverviewQuery } from 'features/daily/useDailyOverviewQuery';
import { DietPanel } from 'features/daily/DietPanel';
import { TrainingPanel } from 'features/daily/TrainingPanel';
import { ActivityPanel } from './ActivityPanel';
import { SleepPanel } from './SleepPanel';
import { HealthPanel } from './HealthPanel';

export const GetSelectedDailyOverview = ({ selected }) => {
  const { data, isError, isLoading, error } = useDailyOverviewQuery(selected);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <section className="flex w-100 items-center justify-center">
      <div className="max-w-xl flex-1">
        <DietPanel data={data} />
        <TrainingPanel data={data} />
        <ActivityPanel data={data} />
        <SleepPanel data={data} />
        <HealthPanel data={data} />
      </div>
    </section>
  );
};
