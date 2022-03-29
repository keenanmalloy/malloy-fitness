import { MuscleGroups } from 'features/muscle-groups/MuscleGroups';
import Login from 'features/login/Login';
import React from 'react';
import Upload from 'features/Upload';

function HomePage() {
  return (
    <div>
      HomePage
      <MuscleGroups />
      <Upload />
      <Login />
    </div>
  );
}

export default HomePage;
