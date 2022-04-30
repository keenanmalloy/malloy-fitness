import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import MoodSurvey from 'features/survey/MoodSurvey';

const MoodPage = () => {
  return (
    <Layout>
      <section>
        <MoodSurvey />
      </section>
    </Layout>
  );
};

export default MoodPage;
