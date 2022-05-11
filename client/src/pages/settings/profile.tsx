import { GetAccount } from 'features/account/components/GetAccount';
import React from 'react';

function ProfilePage() {
  return (
    <main className="h-full min-h-screen">
      <GetAccount />
    </main>
  );
}

export default ProfilePage;
