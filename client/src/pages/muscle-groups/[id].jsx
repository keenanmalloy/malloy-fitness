import Layout from 'features/common/Layout';
import { MuscleGroup } from 'features/muscle-groups/components/MuscleGroup';

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
    <Layout>
      <h1 className="text-2xl p-5">Muscle Group</h1>
      <MuscleGroup muscleGroupId={muscleGroupId} />
    </Layout>
  );
};

export default MuscleGroupsPage;
