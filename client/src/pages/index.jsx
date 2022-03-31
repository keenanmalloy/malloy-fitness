import { MuscleGroups } from 'features/muscle-groups/MuscleGroups';
import Login from 'features/login/Login';
import React from 'react';
import Upload from 'features/Upload';
import { Profile } from 'features/account/Profile';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Profile />
    </div>
  );
}

export default HomePage;
