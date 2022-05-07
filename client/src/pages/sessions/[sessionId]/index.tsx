import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CgCalendarDates } from 'react-icons/cg';
import { GiTrafficLightsReadyToGo } from 'react-icons/gi';
import { FaRegTired, FaWeightHanging } from 'react-icons/fa';
import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import { Skeleton } from 'features/common/Skeleton';
import FullPageModal from 'features/modal/FullPageModal';
import Image from 'next/image';
import { GetStaticPropsContext } from 'next';

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
  const [isOpen, setIsOpen] = useState(false);
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
        <p>No sets have been logged</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-1">
        <div className="flex items-center flex-col py-5">
          <div className="pb-5">
            <FaWeightHanging size={50} />
          </div>
          <h2>Volume (LBS)</h2>
          <p>0</p>
        </div>
        <div className="flex justify-evenly">
          <span className="flex flex-col">
            EXERCISES
            <p className="flex justify-center">0</p>
          </span>
          <span className="flex flex-col">
            SETS
            <p className="flex ">0</p>
          </span>
          <span className="flex flex-col">
            REPS
            <p className="flex justify-center ">0</p>
          </span>
        </div>
        <div className="flex justify-evenly py-6">
          <span className="flex flex-col items-center">
            <CgCalendarDates size={50} />
            ROTATION
            <p className="flex justify-center">1</p>
          </span>
          <span className="flex flex-col items-center">
            <GiTrafficLightsReadyToGo size={50} />
            READINESS
            <p className="flex ">0/5</p>
          </span>
          <span className="flex flex-col items-center">
            <AiOutlineClockCircle size={50} />
            MINUTES
            <p className="flex justify-center ">0</p>
          </span>
          <span className="flex flex-col items-center">
            <FaRegTired size={50} />
            INTENSITY
            <p className="flex justify-center ">0/10</p>
          </span>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => setIsOpen(!isOpen)}>Overview</Button>
          <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
            <button
              className="sticky top-0 right-0 p-2"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
            <div className="flex flex-col">
              <h2>OVERVIEW</h2>
              <p></p>
            </div>
            <h2>
              {data.session.exercises.map((ex) => {
                return (
                  <div className="flex flex-col">
                    <div className="mb-5 w-full aspect-video relative">
                      <Image
                        src={`https://thumbnails.trckd.ca/${ex.video}-0.jpg`}
                        layout="fill"
                        className="-z-10"
                      />
                    </div>
                    <p>{ex.name}</p>
                    <section className="py-5">
                      <header className="flex justify-between">
                        <div className="flex-1"></div>
                        <div className="flex-1">Reps</div>
                        <div className="flex-1">Weight (LBS)</div>
                      </header>
                      <main>
                        {ex.sets.map((set, index) => {
                          return (
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col flex-1">
                                Set <span>0{index + 1}</span>
                              </div>
                              <div className="flex-1">{set.repetitions}</div>
                              <div className="flex-1">{set.weight}</div>
                            </div>
                          );
                        })}
                      </main>
                    </section>
                  </div>
                );
              })}
            </h2>
          </FullPageModal>
        </div>
      </div>
    </Layout>
  );
};

export default SummaryPage;
