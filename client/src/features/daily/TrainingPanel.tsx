import { ScheduleNextDay } from 'features/feed/Panel';
import Overview from 'features/workout-overview/Overview';
import Image from 'next/image';
import React from 'react';

export const TrainingPanel = ({ data }) => {
  if (!data.sessions.length) {
    return (
      <section className="flex flex-col">
        <h2 className="flex flex-col text-center text-sm text-gray-500">
          No training tracked for today
        </h2>
        <div className="max-w-md w-full flex justify-center">
          <ScheduleNextDay day={0} />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center w-full rounded-sm pb-2 space-y-2">
      {data.sessions.map((session) => {
        return (
          <article className="flex" key={session.session_id}>
            <div className="h-full w-full aspect-video relative">
              {!session.video ? (
                <div className="bg-gray-100 h-full w-full rounded-md" />
              ) : (
                <Image
                  src={`https://thumbnails.trckd.ca/${session.video}-0.jpg`}
                  layout="fill"
                  className="-z-10  rounded-md"
                />
              )}
            </div>
            <div className="w-full pt-3 px-3 flex flex-col justify-between relative">
              <div className="flex items-center overflow-hidden ">
                <span
                  style={{
                    fontSize: '0.65rem',
                  }}
                  className="absolute text-xs top-0 left-2 px-2 py-0.5 rounded-md bg-red-500 text-white uppercase"
                >
                  {session.category}
                </span>

                <span
                  style={{
                    fontSize: '0.65rem',
                  }}
                  className={`absolute text-xs top-0 right-3 px-2 py-0.5 rounded-md uppercase ${
                    session.completed ? `bg-green-400` : `bg-yellow-500`
                  }  text-white`}
                >
                  {session.completed ? 'completed' : 'incomplete'}
                </span>
                <div className="pt-3">
                  <h2 className="text-lg font-medium text-ellipsis truncate overflow-hidden leading-tight">
                    {session.name}
                  </h2>

                  <p className="text-xs text-gray-500 pb-2">
                    {session.description}
                  </p>
                </div>
              </div>
              <div>
                <Overview sessionId={session.session_id} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};
