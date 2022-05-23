import React from 'react';
import Layout from 'features/common/Layout';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';
import { Skeleton } from 'features/common/Skeleton';
import { GetStaticPropsContext } from 'next';
import { Survey } from 'features/survey/Survey';
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

const StartSessionSurvey = ({ sessionId }: Props) => {
  const { data, isError, isLoading } = useSessionSummaryQuery(sessionId);

  if (isLoading) {
    return (
      <main className="py-5 bg-slate-900 min-h-screen">
        <Header />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="py-5 bg-slate-900 min-h-screen">
        <Header />
        <p>Something went wrong</p>
      </main>
    );
  }

  if (!data || !data.session) {
    return (
      <main className="py-5 bg-slate-900 min-h-screen">
        <Header />
        <p>No session found</p>
      </main>
    );
  }

  if (!data.session.task_order) {
    return (
      <main className="py-5 bg-slate-900 min-h-screen">
        <Header />
        <p>No task order found</p>
      </main>
    );
  }

  return (
    <Survey
      sessionId={sessionId}
      data={{
        readiness_energy: data.session.readiness_energy,
        readiness_mood: data.session.readiness_mood,
        readiness_stress: data.session.readiness_stress,
        readiness_soreness: data.session.readiness_soreness,
        readiness_sleep: data.session.readiness_sleep,
      }}
      firstTaskId={data.session.task_order[0]}
    />
  );
};

export default StartSessionSurvey;
