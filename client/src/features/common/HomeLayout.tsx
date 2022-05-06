import React from 'react';
import Navbar from './Navbar';
import { HomeHeader } from './HomeHeader';

const HomeLayout = ({ children }) => {
  return (
    <main>
      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '40px' }} />
      <HomeHeader />

      <section className="flex w-100 items-center justify-center">
        <div className="max-w-xl flex-1">{children}</div>
      </section>

      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '70px' }} />
      <Navbar />
    </main>
  );
};

export default HomeLayout;
