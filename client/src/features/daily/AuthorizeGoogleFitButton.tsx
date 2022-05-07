import { useRouter } from 'next/router';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export const AuthorizeGoogleFitButton = () => {
  const router = useRouter();
  const handleSubmit = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/providers/google/fit`
    );
  };

  return (
    <div className="flex justify-center pt-3">
      <button
        className=" bg-slate-900 text-white flex items-center px-6 py-2 rounded-md shadow-md justify-center"
        onClick={handleSubmit}
      >
        <FcGoogle className="text-3xl" />{' '}
        <p className="px-2 text-sm">Connect Google Fit</p>
      </button>
    </div>
  );
};
