import Layout from 'features/common/Layout';
import { MuscleGroups } from 'features/muscle-groups/components/MuscleGroups';

const MuscleGroupsPage = () => {
  return (
    <Layout>
      <h1 className="py-5">Muscle Groups</h1>
      <MuscleGroups />
    </Layout>
  );
};

export default MuscleGroupsPage;
