import React from 'react';
import { useDailyOverviewQuery } from 'features/daily/useDailyOverviewQuery';
import { DietPanel } from 'features/daily/DietPanel';
import { TrainingPanel } from 'features/daily/TrainingPanel';
import { ActivityPanel } from './ActivityPanel';
import { SleepPanel } from './SleepPanel';
import { HealthPanel } from './HealthPanel';
import { Divider } from 'features/feed/Divider';
import { UserAction } from './UserAction';

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
      <ul className="max-w-xl flex-col flex-1 divider-y">
        <div className="h-28" />
        <li>
          <Divider label="Nutrition" />
          <DietPanel data={data} />
        </li>
        <li>
          <Divider label="Training" />
          <TrainingPanel data={data} />
        </li>
        <li>
          <Divider label="Activity" />
          <ActivityPanel data={data} />
        </li>
        <li>
          <Divider label="Sleep" />
          <SleepPanel data={data} />
        </li>
        <li>
          <Divider label="Health" />
          <HealthPanel data={data} />
        </li>
      </ul>

      <UserAction selected={selected} />
    </section>
  );
};
