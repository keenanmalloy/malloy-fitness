import React from 'react';
import { RiUser3Line, RiSearchLine } from 'react-icons/ri';
import Link from 'next/link';

export const Header = () => {
  return (
    <nav className="dark:bg-gray-900 p-2 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center">
      <div className="max-w-2xl mx-auto px-2 text-gray-300 flex justify-between w-full">
        <div className="flex-1 flex items-center justify-between ">
          <Link href="/profile">
            <button>
              <RiUser3Line
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>

          <Link href="/">
            <div className="flex">
              <h1 className="uppercase text-base">tr</h1>
              <h1 className="uppercase text-base text-gray-400">a</h1>
              <h1 className="uppercase text-base">ck</h1>
              <h1 className="uppercase text-base text-gray-400">e</h1>
              <h1 className="uppercase text-base">d</h1>
            </div>
          </Link>

          <div></div>
        </div>
      </div>
    </nav>
  );
};
