import React from 'react';
import { RiUser3Line, RiSearchLine } from 'react-icons/ri';
import Link from 'next/link';

export const Header = () => {
  return (
    <nav className="dark:bg-gray-900 p-2 bg-white shadow md:flex md:items-center md:justify-between md:p-6 fixed top-0 left-0 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-gray-300">
        <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
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

          <div className="flex">
            <h1 className="uppercase text-base">tr</h1>
            <h1 className="uppercase text-base text-gray-400">a</h1>
            <h1 className="uppercase text-base">ck</h1>
            <h1 className="uppercase text-base text-gray-400">e</h1>
            <h1 className="uppercase text-base">d</h1>
          </div>

          <Link href="/search">
            <button>
              <RiSearchLine
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
