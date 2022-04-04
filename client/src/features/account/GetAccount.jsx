import { AccountPanel } from 'features/account/AccountPanel';
import { useAccountQuery } from 'features/account/useAccountQuery';

export const GetAccount = () => {
  const { data, isLoading, isError } = useAccountQuery();

  if (isLoading) {
    return <div className="w-72">loading...</div>;
  }

  if (isError) {
    return <p className="text-red-500">Error fetching account...</p>;
  }

  return <AccountPanel account={data.account} />;
};
