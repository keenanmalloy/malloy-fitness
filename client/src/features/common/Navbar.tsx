import { useRouter } from 'next/router';
import { RiHome5Fill } from 'react-icons/ri';
import { IoBarbell } from 'react-icons/io5';
import { GiMuscleUp, GiWeightLiftingUp, GiKnifeFork } from 'react-icons/gi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { BiLibrary } from 'react-icons/bi';
import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: (
      <RiHome5Fill
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    name: 'Training',
    href: '/training',
    icon: (
      <GiWeightLiftingUp
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  // {
  //   name: 'Diet',
  //   href: '/diet',
  //   icon: (
  //     <GiKnifeFork
  //       style={{
  //         width: 20,
  //         height: 20,
  //       }}
  //     />
  //   ),
  // },
  {
    name: 'CheckIn',
    href: '/check-in',
    icon: (
      <FaChalkboardTeacher
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    name: 'Library',
    href: '/library',
    icon: (
      <BiLibrary
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
];

const libraryNavigation = [
  {
    name: 'Workouts',
    href: '/workouts',
    icon: (
      <GiWeightLiftingUp
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    name: 'Exercises',
    href: '/exercises',
    icon: (
      <IoBarbell
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },

  {
    name: 'Muscles',
    href: '/muscle-groups',
    icon: (
      <GiMuscleUp
        style={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { asPath } = useRouter();

  return (
    <>
      {isOpen && (
        <nav className=" p-2 bg-white shadow fixed bottom-16 left-0 w-full">
          <div className="max-w-7xl mx-auto px-2">
            <div className="flex-1 flex items-center justify-center">
              {libraryNavigation.map((item) => {
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        item.href === asPath
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-800 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-xs font-medium'
                      )}
                    >
                      <div className="flex justify-center">{item.icon}</div>
                      <p>{item.name}</p>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
      <nav className="dark:bg-gray-900 py-2 bg-white shadow flex items-center z-40 justify-between fixed bottom-0 left-0 right-0 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex-1 flex items-center justify-center">
            {navigation.map((item) => {
              if (item.name === 'Library') {
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames(
                      item.href === asPath
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'px-3 py-2 rounded-md text-xs font-medium'
                    )}
                  >
                    <div className="flex justify-center">{item.icon}</div>
                    <p>{item.name}</p>
                  </button>
                );
              }
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={classNames(
                      item.href === asPath
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'px-3 py-2 rounded-md text-xs font-medium'
                    )}
                  >
                    <div className="flex justify-center">{item.icon}</div>
                    <p>{item.name}</p>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
