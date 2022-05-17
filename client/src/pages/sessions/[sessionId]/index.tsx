import React from 'react';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';
import { CgSpinner } from 'react-icons/cg';
import { GetStaticPropsContext } from 'next';
import { SessionSummary } from 'features/sessions/SessionSummary';
import { Header } from 'features/common/Header';

export async function getStaticPaths() {
  arguments;
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const sessionId = params && params.sessionId;

  return {
    props: { sessionId },
  };
}
interface Props {
  sessionId: string;
}

const SummaryPage = ({ sessionId }: Props) => {
  const { data, isError, isLoading } = useSessionSummaryQuery(sessionId);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-10 bg-slate-900 flex justify-center items-center">
        <Header />
        <div className="h-10" />
        <CgSpinner size={32} className="animate-spin text-green-500" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen pt-10 bg-slate-900">
        <Header />
        <p>Something went wrong</p>
      </main>
    );
  }

  if (!data || !data.session) {
    return (
      <main className="min-h-screen pt-10 bg-slate-900">
        <Header />
        <p>No session found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-10 bg-slate-900">
      <Header />
      <SessionSummary data={data} />
    </main>
  );
};

export default SummaryPage;
