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
    <div>
      Profile
      <p>{data.session.account.name}</p>
      <p>{data.session.account.email}</p>
      <img src={data.session.account.avatar_url} />
      <Logout />
    </div>
  );
};
