import Overview from 'features/workout-overview/Overview';
import Image from 'next/image';
import React from 'react';
import { GetDailyResponse } from './types';

interface Props {
  data: GetDailyResponse;
}

export const TrainingPanel = ({ data }: Props) => {
  return (
    <section className="flex flex-col justify-center w-full rounded-sm py-3 space-y-2 pl-3">
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
                  className="absolute text-xs top-0 left-2 px-2 py-0.5 rounded-md bg-green-50 text-slate-900 uppercase"
                >
                  {session.category}
                </span>

                {session.completed && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                    }}
                    className={`absolute text-xs top-0 right-3 px-2 py-0.5 rounded-md uppercase bg-green-50
                      text-slate-900 `}
                  >
                    completed
                  </span>
                )}

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
