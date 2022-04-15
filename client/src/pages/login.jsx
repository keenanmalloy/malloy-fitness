import React from 'react';
import Login from 'features/account/components/Login';
import Layout from 'features/common/Layout';

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex h-screen justify-center items-center flex-col">
        <h1 className="text-3xl p-5">Welcome to tracked</h1>
        <Login />
      </div>
    </Layout>
  );
};

export default LoginPage;
