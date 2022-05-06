import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';
import Link from 'next/link';
import { DeleteMuscleGroup } from 'features/muscle-groups/components/DeleteMuscleGroup';
import { EditMuscleGroup } from 'features/muscle-groups/components/EditMuscleGroup';
import { SearchMuscleGroups } from 'features/muscle-groups/components/SearchMuscleGroups';
import { useState } from 'react';
import { Skeleton } from 'features/common/Skeleton';

export const MuscleGroups = () => {
  const { data, isError, isLoading } = useMuscleGroupsQuery();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  if (isLoading) {
    return (
      <div className="p-5">
        <Skeleton className="h-10 w-full mt-5" />
        <Skeleton className="h-10 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-5" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <section className="relative p-5">
        <SearchMuscleGroups
          setSortBy={setSortBy}
          query={query}
          setQuery={setQuery}
          role={data?.role}
        />
        <ul className="flex flex-col divide-y-2 divide-gray-100">
          {/* @@TODO add error alert component here */}
          <p style={{ color: 'red' }}>fetching error...</p>{' '}
        </ul>
      </section>
    );
  }

  if (!data || !data.muscleGroups.length) {
    return (
      <section className="relative p-5">
        <SearchMuscleGroups
          setSortBy={setSortBy}
          query={query}
          setQuery={setQuery}
          role={data?.role}
        />
        <ul className="flex flex-col divide-y-2 divide-gray-100">
          {/* @@TODO add success alert component here */}
          <p>no muscle-groups fetched</p>{' '}
        </ul>
      </section>
    );
  }

  return (
    <section className="relative p-5">
      <SearchMuscleGroups
        setSortBy={setSortBy}
        query={query}
        setQuery={setQuery}
        role={data?.role}
      />
      <ul className="flex flex-col divide-y-2 divide-gray-100">
        {
          /* Results with search */
          query ? (
            <>
              {data.muscleGroups
                .sort((a, b) => {
                  if (sortBy === 'A-Z') {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  }
                  if (sortBy === 'Z-A') {
                    if (a.name > b.name) {
                      return -1;
                    }
                    if (a.name < b.name) {
                      return 1;
                    }
                    return 0;
                  }

                  return +a.muscle_group_id - +b.muscle_group_id;
                })
                .filter(
                  (mg) =>
                    mg.name.toLowerCase().includes(query.toLowerCase()) ||
                    mg?.description?.toLowerCase().includes(query.toLowerCase())
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
                        {data.role === 'developer' && (
                          <div className="flex">
                            <DeleteMuscleGroup id={mg.muscle_group_id} />
                            <div className="w-1" />
                            <EditMuscleGroup
                              name={mg.name}
                              description={mg.description}
                              image={mg.image}
                              refetchKey="fetchMuscleGroups"
                              id={mg.muscle_group_id}
                            />
                          </div>
                        )}
                      </footer>
                    </li>
                  );
                })}
            </>
          ) : (
            /* Results without search */

            <>
              {data.muscleGroups
                .sort((a, b) => {
                  if (sortBy === 'A-Z') {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  }
                  if (sortBy === 'Z-A') {
                    if (a.name > b.name) {
                      return -1;
                    }
                    if (a.name < b.name) {
                      return 1;
                    }
                    return 0;
                  }

                  return +a.muscle_group_id - +b.muscle_group_id;
                })
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
                        {data.role === 'developer' && (
                          <div className="flex">
                            <DeleteMuscleGroup id={mg.muscle_group_id} />
                            <div className="w-1" />
                            <EditMuscleGroup
                              name={mg.name}
                              description={mg.description}
                              image={mg.image}
                              refetchKey="fetchMuscleGroups"
                              id={mg.muscle_group_id}
                            />
                          </div>
                        )}
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
