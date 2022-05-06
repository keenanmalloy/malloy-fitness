import '../styles/globals.css';
import '../styles/calendar.css';

import { QueryClient, QueryClientProvider } from 'react-query';
import Router from 'next/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.log({ error });
        Router.push('/login');
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
