import { useMuscleGroupsQuery } from './useMuscleGroupsQuery';
import Link from 'next/link';
import { CreateMuscleGroup } from './CreateMuscleGroup';
import { DeleteMuscleGroup } from './DeleteMuscleGroup';
import { Button } from 'features/common/Button';
import { EditMuscleGroup } from './EditMuscleGroup';

export const MuscleGroups = () => {
  const { data, isError, isLoading } = useMuscleGroupsQuery();

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
    <section className="pb-32">
      <ul>
        {data.muscleGroups.map((mg) => {
          return (
            <li key={mg.muscle_group_id} className="my-2 p-5 rounded-md">
              <h3 className="text-lg">{mg.name}</h3>
              <p className="text-xs">{mg.description}</p>

              <div>
                <Link href={`/muscle-groups/${mg.muscle_group_id}`}>
                  <Button>Visit</Button>
                </Link>

                <DeleteMuscleGroup id={mg.muscle_group_id} />

                <EditMuscleGroup mg={mg} />
              </div>
            </li>
          );
        })}
      </ul>

      <CreateMuscleGroup />
    </section>
  );
};
