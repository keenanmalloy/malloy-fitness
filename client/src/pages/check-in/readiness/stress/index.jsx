import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import Stress from 'features/survey/StressSurvey';

const StressPage = () => {
  return (
    <Layout>
      <section>
        <Stress />
      </section>
    </Layout>
  );
};

export default StressPage;
