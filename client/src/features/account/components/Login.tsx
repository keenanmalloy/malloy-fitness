import { Logo } from 'features/common/Logo';
import { useRouter } from 'next/router';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const router = useRouter();
  const handleSubmit = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/providers/google`
    );
  };

  return (
    <div className=" flex min-h-screen justify-center items-center flex-col bg-slate-900 ">
      <div className="flex space-x-4">
        <Logo className="w-14 fill-green-500 mt-10" />
      </div>

      <div className="flex justify-center pt-3">
        <button
          className=" bg-slate-800 text-white flex items-center px-6 py-2 rounded-md shadow-md justify-center"
          onClick={handleSubmit}
        >
          <FcGoogle className="text-3xl" />{' '}
          <p className="px-2 text-sm">Login with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
