import Layout from 'features/common/Layout';
import { MuscleGroup } from 'features/muscle-groups/components/MuscleGroup';
import { GetStaticPropsContext } from 'next';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const muscleGroupId = params && params.id;

  return {
    props: { muscleGroupId },
  };
}

interface Props {
  muscleGroupId: string;
}
const MuscleGroupsPage = ({ muscleGroupId }: Props) => {
  return (
    <Layout>
      <h1 className="text-2xl p-5">Muscle Group</h1>
      <MuscleGroup muscleGroupId={muscleGroupId} />
    </Layout>
  );
};

export default MuscleGroupsPage;
