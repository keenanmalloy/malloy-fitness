import { Button } from 'features/common/Button';
import React from 'react';
import { useAccountQuery } from 'features/account/api/useAccountQuery';
import { useRouter } from 'next/router';

export const Logout = () => {
  const { data, isError, isLoading } = useAccountQuery();

  const router = useRouter();

  const handleClick = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.reload('/');
  };

  return (
    <div>
      <Button onClick={handleClick}>Logout</Button>
    </div>
  );
};
