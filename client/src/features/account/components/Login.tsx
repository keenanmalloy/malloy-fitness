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
      <div className="relative flex h-screen justify-center items-center flex-col">
        <h1 className="text-3xl">Welcome to</h1>
        <div className="flex">
          <h1 className="uppercase text-3xl">tr</h1>
          <h1 className="uppercase text-3xl text-gray-400">a</h1>
          <h1 className="uppercase text-3xl">ck</h1>
          <h1 className="uppercase text-3xl text-gray-400">e</h1>
          <h1 className="uppercase text-3xl">d</h1>
        </div>
        <button className="flex drop-shadow-md" onClick={handleSubmit}>
          <img src="googleSignin.png" />
        </button>
      </div>
    </div>
  );
};

export default Login;
