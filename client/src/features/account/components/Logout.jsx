import { Button } from 'features/common/Button';
import React from 'react';
import { useRouter } from 'next/router';

export const Logout = () => {
  const router = useRouter();

  const handleClick = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      router.reload('/');
    });
  };

  return <Button onClick={handleClick}>Logout</Button>;
};
