import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'features/common/Button';

const Login = () => {
  const router = useRouter();
  const handleSubmit = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/providers/google`
    );
  };

  return (
    <div>
      <Button onClick={handleSubmit}>Login</Button>
    </div>
  );
};

export default Login;
