import { useRouter } from 'next/router';
import React from 'react';

const Login = () => {
  const router = useRouter();
  const handleSubmit = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/providers/google`
    );
  };

  return (
    <div>
      <button className="flex drop-shadow-md" onClick={handleSubmit}>
        <img src="googleSignin.png" />
      </button>
    </div>
  );
};

export default Login;
