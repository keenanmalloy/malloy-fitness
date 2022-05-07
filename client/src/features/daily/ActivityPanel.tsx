import React from 'react';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';
import { GetDailyResponse } from './types';

interface Props {
  data: GetDailyResponse;
}

export const ActivityPanel = ({ data }: Props) => {
  return (
    <section>
      <div className="pb-5 px-3 py-3">
        <div className="flex justify-center text-center mx-3 py-2">
          {data.steps}/10000 Steps Today
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-800">
          <div
            className="bg-green-400 h-2.5 rounded-full"
            style={{
              width: `${(data.steps / 10000) * 100}%`,
            }}
          />
        </div>
      </div>
      {/* <div className="pb-8">
        <div className="flex justify-center text-center rounded-sm mx-3 pb-2">
          30/180 minutes @ 140 BPM of Cardio Today
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-green-400 h-2.5 rounded-full"
            style={{
              width: `${(data.steps / 10000) * 100}%`,
            }}
          />
        </div>
      </div> */}
    </section>
  );
};