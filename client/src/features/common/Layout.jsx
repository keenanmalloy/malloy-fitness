import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <main>
      <section className="flex w-100 items-center justify-center">
        <div className="max-w-xl">{children}</div>
      </section>
      <Navbar />
    </main>
  );
};

export default Layout;
