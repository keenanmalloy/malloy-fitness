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

  return (
    <Layout>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex p-1 mt-1 space-x-1 bg-green-200/20 ">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-green-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-green-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Account
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-green-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-green-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Goals
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-green-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-300 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-green-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Settings
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2">
          <Tab.Panel className={classNames('bg-white rounded-xl p-3', '')}>
            <GetAccount />
          </Tab.Panel>
          <Tab.Panel className={classNames('bg-white rounded-xl p-3')}>
            <Goals />
          </Tab.Panel>
          <Tab.Panel className={classNames('bg-white rounded-xl p-3')}>
            <Settings />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
}

export default ProfilePage;
