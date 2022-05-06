import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { apiClient } from 'config/axios';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { Skeleton } from 'features/common/Skeleton';
import SessionTimer from 'features/sessions/SessionTimer';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';
import { Range } from 'react-range';
import FullPageModal from 'features/common/FullPageModal';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const sessionId = params && params.sessionId;

  return {
    props: { sessionId },
  };
}

const EndPage = ({ sessionId }) => {
  const [values, setValues] = useState([0]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const { data, isError, isLoading } = useSessionSummaryQuery(sessionId);

  const endWorkout = async (id) => {
    const { data } = await apiClient.patch(`/sessions/${id}/end`);
    return data;
  };

  const handleStop = () => {
    endWorkout(sessionId)
      .then(() => {
        router.push('/');
      })
      .catch((e) => {
        console.log({ e });
        setError(true);
      });
  };

  const handleFinishSession = () => {
    endWorkout(sessionId)
      .then(() => {
        router.push(`/sessions/${sessionId}/`);
      })
      .catch((e) => {
        console.log({ e });
        setError(true);
      });
  };

  if (isLoading) {
    return (
      <div className="py-5">
        <Skeleton className="h-20 w-full mt-7" />
        <Skeleton className="h-44 w-full mt-1" />
        <Skeleton className="h-28 w-full mt-10" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 mt-8 mr-4 rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-full mt-8 mx-4 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col ">
        {/* <SessionTimer
          endedAt={data.session.ended_at}
          startedAt={data.session.started_at}
        /> 

        {/* <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre> */}
      </div>
      <div className="flex justify-center py-96 px-8 flex-col">
        <Button onClick={() => setIsOpen(!isOpen)}>End Workout</Button>
        <div className="text-center  divide-solid border-solid border-b py-5">
          OR
        </div>
        <div>
          <p className="text-center py-5">Want to add more?</p>
          <div className="flex flex-col">
            <button className="text-blue-500 mb-4">Add Exercise</button>
            <button className="text-blue-500">Add Cardio</button>
          </div>
        </div>
        <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
          <div className="flex justify-center">
            <div className="flex flex-col text-center">
              <h2>INTENSITY</h2>
              <h3>How hard was this session?</h3>
              <p className="py-6">-</p>
              <p>
                {values} - {intensityByValue(values[0])}
              </p>
              <div>
                <Range
                  min={0}
                  max={10}
                  step={1}
                  values={values}
                  onChange={(values) => {
                    setValues(values);
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-4 pr-2 my-4 bg-gradient-to-r from-green-500 via-orange-500 to-red-600 rounded-lg"
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="w-7 h-7 transform translate-x-10 bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white text-xs flex justify-center items-center"
                    >
                      {values}
                    </div>
                  )}
                />
              </div>
              <div>
                <h2 className="pb-1">SESSION REFELECTION</h2>
                <textarea
                  className="border-2 border-gray-400 rounded-md p-3
                  w-full h-24"
                  placeholder="How was todays session? Leave notes about your session here e.g any progressions, regressions, maintaining any sets, overall performance, injuries etc."
                />
              </div>
              <div className="py-10 w-96">
                <Button onClick={handleFinishSession} className="w-full mb-6">
                  Finish Session
                </Button>
                <Button onClick={() => setIsOpen(false)} className="w-full">
                  Back to Training
                </Button>
              </div>
            </div>
          </div>
        </FullPageModal>
      </div>
    </div>
  );
};

export default EndPage;

const intensityByValue = (value) => {
  switch (value) {
    case 0:
      return 'Rest';
    case 1:
      return 'Chair Yoga';
    case 2:
      return 'Low Intensity';
    case 3:
      return 'Really Easy';
    case 4:
      return 'Easy';
    case 5:
      return 'Moderate';
    case 6:
      return 'Hard';
    case 7:
      return 'Really Hard';
    case 8:
      return 'Intense';
    case 9:
      return 'Extreme';
    case 10:
      return 'Maximal';
    default:
      return 'Low';
  }
};
