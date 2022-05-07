import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CgCalendarDates } from 'react-icons/cg';
import { GiTrafficLightsReadyToGo } from 'react-icons/gi';
import { FaRegTired, FaWeightHanging } from 'react-icons/fa';
import { Button } from 'features/common/Button';
import { Skeleton } from 'features/common/Skeleton';
import FullPageModal from 'features/modal/FullPageModal';
import Image from 'next/image';
import { GetStaticPropsContext } from 'next';
import { SessionSummary } from 'features/sessions/SessionSummary';

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
      <Layout>
        <Skeleton className="h-20 w-full mt-7" />
        <Skeleton className="h-44 w-full mt-1" />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <p>Something went wrong</p>
      </Layout>
    );
  }

  if (!data || !data.session) {
    return (
      <Layout>
        <p>No session found</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <SessionSummary data={data} />
    </Layout>
  );
};

export default SummaryPage;
