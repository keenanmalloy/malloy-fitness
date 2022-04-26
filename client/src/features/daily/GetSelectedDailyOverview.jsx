import React from 'react';
import { Steps } from 'features/daily/Steps';
import { useDailyOverviewQuery } from 'features/daily/useDailyOverviewQuery';
import { DietPanel } from 'features/daily/DietPanel';
import { TrainingPanel } from 'features/daily/TrainingPanel';

export const GetSelectedDailyOverview = ({ selected }) => {
  const { data, isError, isLoading } = useDailyOverviewQuery(selected);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  console.log({ data });

  return (
    <section className="flex w-100 items-center justify-center">
      <div className="max-w-xl flex-1">
        <DietPanel data={data} />
        <TrainingPanel data={data} />
        <Steps data={data} />
      </div>
    </section>
  );
};
