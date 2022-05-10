import { AccountPanel } from 'features/account/components/AccountPanel';
import { useAccountQuery } from 'features/account/api/useAccountQuery';
import Link from 'next/link';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Skeleton } from 'features/common/Skeleton';

export const GetAccount = () => {
  const { data, isLoading, isError } = useAccountQuery();

  if (isLoading) {
    return (
      <>
        <nav className="dark:bg-gray-900 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center border-b-2 border-slate-800 border-solid">
          <div className="max-w-2xl mx-auto flex justify-between w-full">
            <div className="flex-1 flex items-center justify-left ">
              <Link href="/settings">
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
                <h1 className="flex text-xl text-white">Profile</h1>
                <span className="text-xs text-slate-300">
                  <Skeleton className="w-32 h-4" />
                </span>
              </div>
            </div>
          </div>
        </nav>

        <section className="bg-slate-900 min-h-screen">
          <div style={{ height: '60px' }} />

          <ul className="flex flex-col"></ul>
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <nav className="dark:bg-gray-900 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center border-b-2 border-slate-800 border-solid">
          <div className="max-w-2xl mx-auto flex justify-between w-full">
            <div className="flex-1 flex items-center justify-left ">
              <Link href="/settings">
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
                <h1 className="flex text-xl text-white">Profile</h1>
                <span className="text-xs text-slate-300">
                  <Skeleton className="w-32 h-12" />
                </span>
              </div>
            </div>
          </div>
        </nav>

        <section className="bg-slate-900 min-h-screen">
          <div style={{ height: '60px' }} />

          <ul className="flex flex-col">
            <div className="text-red">Error</div>
          </ul>
        </section>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <nav className="dark:bg-gray-900 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center border-b-2 border-slate-800 border-solid">
          <div className="max-w-2xl mx-auto flex justify-between w-full">
            <div className="flex-1 flex items-center justify-left ">
              <Link href="/settings">
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
                <h1 className="flex text-xl text-white">Profile</h1>
                <span className="text-xs text-slate-300">
                  <Skeleton className="w-32 h-12" />
                </span>
              </div>
            </div>
          </div>
        </nav>

        <section className="bg-slate-900 min-h-screen">
          <div style={{ height: '60px' }} />

          <ul className="flex flex-col">
            <div className="text-red">Couldn't fetch profile</div>
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <nav className="dark:bg-gray-900 bg-white shadow fixed top-0 left-0 w-full z-10 flex flex-col justify-center items-center border-b-2 border-slate-800 border-solid">
        <div className="max-w-2xl mx-auto flex justify-between w-full">
          <div className="flex-1 flex items-center justify-left ">
            <Link href="/settings">
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
              <h1 className="flex text-xl text-white">Profile</h1>
              <span className="text-xs text-slate-300">
                {data.account.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-slate-900 min-h-screen">
        <div style={{ height: '60px' }} />

        <ul className="flex flex-col">
          <AccountPanel account={data.account} />
        </ul>
      </section>
    </>
  );
};
