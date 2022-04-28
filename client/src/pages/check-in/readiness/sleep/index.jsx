import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import SleepSurvey from 'features/survey/SleepSurvey';

const SleepPage = () => {
  return (
    <Layout>
      <section>
        <SleepSurvey />
      </section>
    </Layout>
  );
};

export default SleepPage;
