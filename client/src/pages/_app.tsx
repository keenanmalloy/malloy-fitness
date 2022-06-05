import '../styles/globals.css';
import '../styles/calendar.css';
import Head from 'next/head';

import { QueryClient, QueryClientProvider } from 'react-query';
import Router from 'next/router';
import { AppProps } from 'next/app';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        if (error instanceof ZodError) {
          console.log(`------- ZOD ERROR: `, error.message);
        } else if (error instanceof AxiosError) {
          const isNetworkError =
            error.isAxiosError && error.response === undefined;
          if (isNetworkError) {
            console.log('-- NETWORK ERROR --', error.message);
          }

          const isServerError =
            error.response && [401, 403].includes(error.response.status);
          if (isServerError) {
            console.log('-- SERVER ERROR --', error.message);
            Router.push('/login');
          }
        } else {
          console.log(`------- ERROR FROM _APP: `, { error });
          Router.push('/login');
        }
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
