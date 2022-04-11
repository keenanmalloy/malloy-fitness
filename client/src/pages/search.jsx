import React from 'react';
import Layout from 'features/common/Layout';
import { SearchWorkouts } from 'features/search/SearchWorkouts';

function HomePage() {
  return (
    <Layout>
      <SearchWorkouts />
    </Layout>
  );
}

export default HomePage;
