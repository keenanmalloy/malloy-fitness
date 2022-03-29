import { MuscleGroups } from 'features/muscle-groups/MuscleGroups';
import React from 'react';
import Upload from 'features/Upload';

function HomePage() {
  return (
    <div>
      HomePage
      <MuscleGroups />
      <Upload />
    </div>
  );
}

export default HomePage;
