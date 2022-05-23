import React from 'react';

interface Props {
  data?: any;
}

export const ActivityPanel = ({ data }: Props) => {
  if (!data) return null;

  return (
    <section>
      <div className="pb-5 px-3 py-3">
        <div className="flex justify-center text-center mx-3 py-2">
          {data.steps}/{data.goals.daily_steps_goal} Steps Today
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-800">
          <div
            className={`bg-green-400 h-2.5 shadow-md shadow-green-200 rounded-full ${
              data.steps > data.goals.daily_steps_goal
                ? 'bg-green-400'
                : 'bg-green-400'
            }`}
            style={{
              width: `${
                (data.steps > data.goals.daily_steps_goal
                  ? 1
                  : data.steps / data.goals.daily_steps_goal) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};
