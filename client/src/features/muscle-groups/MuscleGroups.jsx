import { useMuscleGroupsQuery } from './useMuscleGroupsQuery';
import Link from 'next/link';
import { CreateMuscleGroup } from './CreateMuscleGroup';
import { DeleteMuscleGroup } from './DeleteMuscleGroup';
import { EditMuscleGroup } from './EditMuscleGroup';
import { SearchMuscleGroups } from './SearchMuscleGroups';
import { useState } from 'react';

export const MuscleGroups = () => {
  const { data, isError, isLoading } = useMuscleGroupsQuery();
  const [query, setQuery] = useState('');

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.muscleGroups) {
    return <p>none available...</p>;
  }

  return (
    <section className="w-72 relative">
      <SearchMuscleGroups query={query} setQuery={setQuery} />
      <ul className="flex flex-col divide-y-2 divide-gray-100">
        {
          /* Results with search */
          query ? (
            <>
              {data.muscleGroups
                .filter(
                  (mg) =>
                    mg.name.toLowerCase().includes(query.toLowerCase()) ||
                    mg.description.toLowerCase().includes(query.toLowerCase())
                )
                .map((mg) => {
                  return (
                    <li key={mg.muscle_group_id} className="border-solid py-6">
                      <h3 className="text-lg">{mg.name}</h3>
                      <p className="text-xs">{mg.description}</p>

                      <footer className="flex justify-between justify-self-stretch place-content-stretch justify-items-stretch">
                        <Link href={`/muscle-groups/${mg.muscle_group_id}`}>
                          <button className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
                            Visit
                          </button>
                        </Link>
                        <div className="flex">
                          <DeleteMuscleGroup id={mg.muscle_group_id} />
                          <div className="w-1" />
                          <EditMuscleGroup mg={mg} />
                        </div>
                      </footer>
                    </li>
                  );
                })}
            </>
          ) : (
            /* Results without search */

            <>
              {data.muscleGroups.map((mg) => {
                return (
                  <li key={mg.muscle_group_id} className="border-solid py-6">
                    <h3 className="text-lg">{mg.name}</h3>
                    <p className="text-xs">{mg.description}</p>

                    <footer className="flex justify-between justify-self-stretch place-content-stretch justify-items-stretch">
                      <Link href={`/muscle-groups/${mg.muscle_group_id}`}>
                        <button className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
                          Visit
                        </button>
                      </Link>
                      <div className="flex">
                        <DeleteMuscleGroup id={mg.muscle_group_id} />
                        <div className="w-1" />
                        <EditMuscleGroup mg={mg} />
                      </div>
                    </footer>
                  </li>
                );
              })}
            </>
          )
        }
      </ul>
    </section>
  );
};
