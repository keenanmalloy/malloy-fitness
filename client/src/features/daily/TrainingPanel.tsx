import Modal from 'features/modal/Modal';
import { useDeleteSessionMutation } from 'features/sessions/useDeleteSessionMutation';
import Overview from 'features/workout-overview/Overview';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import { GetDailyResponse } from './types';

interface Props {
  data: GetDailyResponse;
}

export const TrainingPanel = ({ data }: Props) => {
  const { mutate, isError, isLoading } = useDeleteSessionMutation();
  return (
    <section className="flex flex-col justify-center w-full rounded-sm py-3 space-y-2 pl-3">
      {data.sessions.map((session) => {
        return (
          <article className="flex relative" key={session.session_id}>
            {!session.completed && !!session.started_at ? (
              <DeleteSesssionConfirmation session={session} />
            ) : !session.completed ? (
              <button
                className="absolute top-0 z-10 right-0 p-1"
                onClick={() =>
                  mutate({
                    sessionId: session.session_id,
                  })
                }
              >
                {isLoading ? (
                  <CgSpinner className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
                  <BiX />
                )}
              </button>
            ) : null}

            <div className="h-full w-full aspect-video relative">
              <Link href={`sessions/${session.session_id}`}>
                <a>
                  {!session.video ? (
                    <div className="bg-gray-100 h-full w-full rounded-md" />
                  ) : (
                    <Image
                      src={`https://thumbnails.trckd.ca/${session.video}-0.jpg`}
                      layout="fill"
                      className="-z-5  rounded-md"
                    />
                  )}
                </a>
              </Link>
            </div>
            <div className="w-full pt-3 px-3 flex flex-col justify-between relative">
              <div className="flex items-center overflow-hidden ">
                <span
                  style={{
                    fontSize: '0.65rem',
                  }}
                  className="absolute text-xs top-0 left-2 px-2 py-0.5 rounded-md bg-green-50 text-slate-900 uppercase"
                >
                  {session.category}
                </span>

                {session.completed && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                    }}
                    className={`absolute text-xs top-0 right-3 px-2 py-0.5 rounded-md uppercase bg-green-50
                      text-slate-900 `}
                  >
                    completed
                  </span>
                )}

                <div className="pt-3">
                  <h2 className="text-lg font-medium text-ellipsis truncate overflow-hidden leading-tight">
                    {session.name}
                  </h2>

                  <p className="text-xs text-gray-500 pb-2">
                    {session.description}
                  </p>
                </div>
              </div>
              <div>
                <Overview sessionId={session.session_id} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

const DeleteSesssionConfirmation = ({
  session,
}: {
  session: GetDailyResponse['sessions'][0];
}) => {
  const { mutate, isError, isLoading } = useDeleteSessionMutation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 z-10 right-0 p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BiX />
      </button>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-medium text-center">
            Are you sure you want to delete this session?
          </h2>
          <div className="flex flex-col justify-center">
            <button
              className="flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => {
                setIsOpen(false);
                mutate({
                  sessionId: session.session_id,
                });
              }}
            >
              <span className="text-sm">Yes</span>
            </button>
            <button
              className="flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-sm">No</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
