import { MuscleGroup } from 'features/muscle-groups/MuscleGroup';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const muscleGroupId = params && params.id;

  return {
    props: { muscleGroupId },
  };
}

const MuscleGroupsPage = ({ muscleGroupId }) => {
  return (
    <div className="p-5">
      <h1 className="text-2xl">Muscle Group</h1>
      <MuscleGroup muscleGroupId={muscleGroupId} />
    </div>
  );
};

export default MuscleGroupsPage;
