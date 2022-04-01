import React from 'react';
import { useAccountQuery } from 'features/account/useAccountQuery';
import { Logout } from 'features/auth/Logout';

export const Profile = () => {
  const { data, isError, isLoading } = useAccountQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (data && !data.session) {
    return <p>none available...</p>;
  }

  return (
    <div className="pt-5">
      <div className="flex w-full justify-between">
        <img
          src={data.session.account.avatar_url}
          className="inline object-cover w-24 h-24 rounded-full"
        />
        <aside className="">
          <p className="text-lg text-gray-800 text-left">
            {data.session.account.name}
          </p>
          <p className="text-gray-500 text-left">
            {data.session.account.email}
          </p>
          <div className="flex align-right pt-5 justify-end">
            <Logout />
          </div>
        </aside>
      </div>
    </div>
  );
};
