import { GetAccount } from 'features/account/components/GetAccount';
import Layout from 'features/common/Layout';
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Goals } from 'features/account/components/Goals';
import { Settings } from 'features/account/components/Settings';

function ProfilePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  if (selectedIndex === 1) {
    return (
      <Layout>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Account
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Goals
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Settings
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            ></Tab.Panel>
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <Goals />
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <Settings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Layout>
    );
  }

  if (selectedIndex === 2) {
    return (
      <Layout>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Account
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Goals
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Settings
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            ></Tab.Panel>
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            ></Tab.Panel>
            <Tab.Panel
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <Settings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Layout>
    );
  }

  return (
    <Layout>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Account
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Goals
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Settings
          </Tab>
        </Tab.List>
      </Tab.Group>
      <section className="p-3">
        <h1 className="text-2xl pb-2">Account</h1>
        <p className="text-gray-500 pb-2">
          This information may be displayed publicly so be careful what you
          share.
        </p>
      </section>

      <GetAccount />
    </Layout>
  );
}

export default ProfilePage;
