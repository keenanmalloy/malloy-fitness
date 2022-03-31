import Layout from '../features/common/Layout';
import '../styles/globals.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Router from 'next/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSettled: (data) => {
        if (data.status !== 'success') {
          Router.push('/login');
        }
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
