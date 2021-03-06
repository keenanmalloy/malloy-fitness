import React from 'react';
import Link from 'next/link';
import { BiCog } from 'react-icons/bi';
import { Logo } from './Logo';

export const Header = () => {
  return (
    <nav className="dark:bg-gray-900 p-2 bg-white shadow fixed top-0 left-0 w-full flex flex-col justify-center items-center z-20">
      <div className="max-w-2xl mx-auto px-2 text-gray-300 flex justify-between w-full">
        <div className="flex-1 flex items-center justify-between ">
          <Link href="/settings">
            <button>
              <BiCog
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>

          <Link href="/">
            <a className="flex items-center justify-center ">
              <Logo className="w-4 fill-green-500" />
              <div className="flex text-lg px-1">
                <h1 className="uppercase">tr</h1>
                <h1 className="uppercase">a</h1>
                <h1 className="uppercase">ck</h1>
                <h1 className="uppercase">e</h1>
                <h1 className="uppercase">d</h1>
              </div>
            </a>
          </Link>

          <div></div>
        </div>
      </div>
    </nav>
  );
};
