import '../styles/globals.css';
import '../styles/calendar.css';
import Head from 'next/head';

import { QueryClient, QueryClientProvider } from 'react-query';
import Router from 'next/router';
import { AppProps } from 'next/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.log(`------- ERROR FROM _APP: `, { error });
        Router.push('/login');
      },
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
