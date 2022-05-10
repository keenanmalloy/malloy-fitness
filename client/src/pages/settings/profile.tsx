import { GetAccount } from 'features/account/components/GetAccount';
import Link from 'next/link';
import React from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';

function ProfilePage() {
  return (
    <main className="h-full min-h-screen">
      <GetAccount />
    </main>
  );
}

export default ProfilePage;
