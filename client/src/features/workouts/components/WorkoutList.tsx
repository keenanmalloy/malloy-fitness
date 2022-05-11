import React from 'react';
import { Schedule } from 'features/Schedule';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  workouts: any[];
}

export const WorkoutList = ({ workouts }: Props) => {
  return (
    <ul className="flex flex-col divide-y-2 divide-gray-100">
      {workouts.map((workout) => (
        <li className="border-solid py-6" key={workout.workout_id}>
          <Link href={`/workouts/${workout.workout_id}`}>
            {!workout.video ? (
              <div className="mb-5 w-full aspect-video relative bg-slate-100  rounded-sm flex justify-center items-center">
                <div className="text-2xl px-6 py-2 m-2 relative">
                  <h1 className="text-slate-900">{workout.name}</h1>
                </div>
              </div>
            ) : (
              <div className="mb-5 w-full aspect-video relative flex justify-center items-center">
                <Image
                  src={`https://thumbnails.trckd.ca/${workout.video}-0.jpg`}
                  layout="fill"
                  className="-z-10 rounded-sm "
                  objectFit="cover"
                  objectPosition={'center'}
                />
                <div className="w-full absolute bg-slate-700 h-full opacity-25 -z-10 blur-md" />

                <div className="text-2xl px-6 py-2 m-2 text-slate-900 -z-10 relative">
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="text-2xl opacity-20  bg-green-300 w-full h-full text-slate-900 -z-10"
                  />{' '}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '93%',
                      height: '80%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="text-2xl opacity-30  bg-green-300 text-slate-900 -z-10"
                  />
                  <h1 className="text-white">{workout.name}</h1>
                </div>
              </div>
            )}
          </Link>

          <main>
            <div className="flex justify-between">
              <div>
                <p className="text-xs">{workout.description}</p>
              </div>

              {workout.category && (
                <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-7 h-7">
                  {workout.category}
                </span>
              )}
            </div>
          </main>

          <footer className="flex justify-center justify-self-stretch place-content-stretch justify-items-stretch">
            <Schedule workoutId={workout.workout_id} />
          </footer>
        </li>
      ))}
    </ul>
  );
};
