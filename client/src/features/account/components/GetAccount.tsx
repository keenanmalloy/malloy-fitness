import { AccountPanel } from 'features/account/components/AccountPanel';
import { useAccountQuery } from 'features/account/api/useAccountQuery';

export const GetAccount = () => {
  const { data, isLoading, isError } = useAccountQuery();

  if (isLoading) {
    return <div className="w-72 p-5">loading...</div>;
  }

  if (isError) {
    return <p className="text-red-500 p-5">Error fetching account...</p>;
  }

  if (!data) {
    return null;
  }

  return <AccountPanel account={data.account} />;
};
