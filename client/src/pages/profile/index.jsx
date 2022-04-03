import { GetAccount } from 'features/account/GetAccount';
import React from 'react';

function ProfilePage() {
  return (
    <div className="px-2 pb-5">
      <h1 className="text-2xl pt-5 pb-2">Account</h1>
      <p className="text-gray-500 pb-2">
        This information may be displayed publicly so be careful what you share.
      </p>
      <GetAccount />
    </div>
  );
}

export default ProfilePage;
