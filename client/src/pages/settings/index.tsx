import React from 'react';
import Link from 'next/link';
import { RiArrowLeftLine } from 'react-icons/ri';
import { BsPerson, BsTrophy } from 'react-icons/bs';
import { Skeleton } from 'features/common/Skeleton';
import { useAccountQuery } from 'features/account/api/useAccountQuery';

function SettingsPage() {
  return (
    <main className="h-full min-h-screen">
      {/* Empty div to cover the height of the navbar */}
      <nav className="dark:bg-gray-900 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center border-b-2 border-slate-800 border-solid">
        <div className="max-w-2xl mx-auto flex justify-between w-full">
          <div className="flex-1 flex items-center justify-left ">
            <Link href="/">
              <button className="p-5 text-white">
                <RiArrowLeftLine
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </button>
            </Link>
            <div>
              <h1 className="flex text-xl text-white">Settings</h1>
              <span className="text-xs text-slate-300">
                <GetAccount />
              </span>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-slate-900 min-h-screen">
        <div style={{ height: '60px' }} />

        <ul className="flex flex-col">
          <SettingPanel
            title={'Profile'}
            description="See information about your account, such as your name and email address"
            href="/settings/profile"
            icon={
              <BsPerson
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            }
          />
          <SettingPanel
            title={'Goals'}
            description="Set daily, weekly and all time goals. See your progress and track how you're doing."
            href="/settings/goals"
            icon={
              <BsTrophy
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            }
          />
        </ul>
      </section>
    </main>
  );
}

export default SettingsPage;

interface SettingPanelProps {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
}

const SettingPanel = ({
  icon,
  description,
  title,
  href,
}: SettingPanelProps) => {
  return (
    <Link href={href}>
      <button className="flex items-center py-5">
        <div className="p-5 text-slate-300">{icon}</div>
        <div className="text-left pr-5">
          <h1 className="text-lg text-white">{title}</h1>
          <p className="text-xs text-slate-300">{description}</p>
        </div>
      </button>
    </Link>
  );
};

const GetAccount = () => {
  const { data, isLoading, isError } = useAccountQuery();

  if (isLoading) {
    return <Skeleton className="w-32 h-4" />;
  }

  if (isError) {
    return null;
  }

  if (!data) {
    return null;
  }

  return <>{data.account.email}</>;
};
