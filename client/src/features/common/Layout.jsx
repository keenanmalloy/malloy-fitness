import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      {children}
      <Navbar />
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
