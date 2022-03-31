import { Button } from 'features/common/Button';
import React from 'react';
import { useAccountQuery } from 'features/account/useAccountQuery';
import { useRouter } from 'next/router';

/**
 * This component should be a button that when clicked opens a modal
 * which has details of logging out of their account and a button, when
 * clicked, sends a POST /auth/logout which removes the users token from
 * the browsers cookie.
 */

export const Logout = () => {
  const { data, isError, isLoading } = useAccountQuery();

  const router = useRouter();

  const handleClick = () => {
    fetch('http://localhost:4000/auth/logout', {
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
