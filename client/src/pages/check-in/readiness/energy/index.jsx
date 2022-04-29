import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import EnergySurvey from 'features/survey/EnergySurvey';

const EnergyPage = () => {
  return (
    <Layout>
      <section>
        <EnergySurvey />
      </section>
    </Layout>
  );
};

export default EnergyPage;
