import React from 'react';
import Login from 'features/account/components/Login';
import Layout from 'features/common/Layout';

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex h-screen justify-center items-center flex-col">
        <Login />
      </div>
    </Layout>
  );
};

export default LoginPage;
