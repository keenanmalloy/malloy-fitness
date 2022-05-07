import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import Soreness from 'features/survey/SorenessSurvey';

function SorenessPage() {
  return (
    <Layout>
      <section>
        <Soreness />
      </section>
    </Layout>
  );
}

export default SorenessPage;
