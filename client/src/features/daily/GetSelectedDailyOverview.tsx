import React from 'react';
import { useDailyOverviewQuery } from 'features/daily/useDailyOverviewQuery';
import { DietPanel } from 'features/daily/DietPanel';
import { TrainingPanel } from 'features/daily/TrainingPanel';
import { ActivityPanel } from './ActivityPanel';
import { SleepPanel } from './SleepPanel';
import { HealthPanel } from './HealthPanel';
import { Divider } from 'features/feed/Divider';
import { UserAction } from './UserAction';
import { SelectedDate } from './types';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';

interface Props {
  selected: SelectedDate;
}

export const GetSelectedDailyOverview = ({ selected }: Props) => {
  const { data, isError, isLoading, error } = useDailyOverviewQuery(selected);

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <section className="flex w-100 items-center justify-center">
      <ul className="max-w-xl flex-col flex-1 divider-y">
        <div className="h-28" />
        {/* <li>
          <Divider label="Nutrition" />
          <DietPanel data={data} />
        </li> */}

        {/* Only show training if its scheduled for today */}
        {data && data.sessions && data.sessions.length > 0 && (
          <li>
            <Divider label="Training" />
            <TrainingPanel data={data} />
          </li>
        )}

        {/* Google Fit Data only shown if authorized */}
        {data && data.steps === null ? (
          <div className="pb-5 px-3">
            <AuthorizeGoogleFitButton />
          </div>
        ) : (
          <>
            <li>
              <Divider label="Activity" />
              <ActivityPanel data={data} />
            </li>
            {/* <li>
              <Divider label="Sleep" />
              <SleepPanel data={data} />
            </li>
            <li>
              <Divider label="Health" />
              <HealthPanel data={data} />
            </li> */}
          </>
        )}
      </ul>

      <UserAction selected={selected} />
    </section>
  );
};
