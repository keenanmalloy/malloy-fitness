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
    <div className="flex justify-center p-5">
      <button
        className="flex items-center  px-5 py-3 rounded-md shadow-md"
        onClick={handleSubmit}
      >
        <FcGoogle className="text-3xl" />{' '}
        <p className="px-2">Connect Google Fit</p>
      </button>
    </div>
  );
};
