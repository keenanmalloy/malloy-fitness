import { GetAccount } from 'features/account/components/GetAccount';
import Layout from 'features/common/Layout';
import React from 'react';

function ProfilePage() {
  return (
    <Layout>
      <section className="px-5">
        <h1 className="text-2xl pt-5 pb-2">Account</h1>
        <p className="text-gray-500 pb-2">
          This information may be displayed publicly so be careful what you
          share.
        </p>
      </section>

      <GetAccount />
    </Layout>
  );
}

export default ProfilePage;
