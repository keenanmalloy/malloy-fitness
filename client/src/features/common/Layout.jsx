import React from 'react';
import Navbar from './Navbar';
import { Header } from './Header';

const Layout = ({ children }) => {
  return (
    <main>
      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '40px' }} />
      <Header />

      <section className="flex w-100 items-center justify-center">
        <div className="max-w-xl flex-1">{children}</div>
      </section>

      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '70px' }} />
      <Navbar />
    </main>
  );
};

export default Layout;
