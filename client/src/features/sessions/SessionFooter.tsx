import { MyTimer } from 'features/timers/Timer';
import { TimerType } from 'features/timers/types';
import Link from 'next/link';
import { useState } from 'react';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

interface SessionFooterProps {
  sessionId: string;
  nextEx: {
    order: {
      exercise_id: string | null;
    };
  };
  prevEx: {
    order: {
      exercise_id: string | null;
    };
  };
}

export const SessionFooter = ({
  prevEx,
  nextEx,
  sessionId,
}: SessionFooterProps) => {
  const [timerType, setTimerType] = useState<TimerType>(null);
  const time = new Date();
  return (
    <div className="flex justify-center w-full fixed bottom-0 left-0 right-0 bg-slate-900 text-white">
      <div className="flex justify-between items-center max-w-md w-full">
        {!prevEx.order.exercise_id ? (
          <Link href={`/sessions/${sessionId}/start`}>
            <button className="flex flex-col justify-center items-center p-4 disabled:opacity-50">
              <BsArrowLeftShort className="w-5 h-5 text-green-500" />
              <p>Prev</p>
            </button>
          </Link>
        ) : (
          <Link
            href={`/sessions/${sessionId}/exercises/${prevEx.order.exercise_id}`}
          >
            <button className="flex flex-col justify-center items-center p-4 disabled:opacity-50">
              <BsArrowLeftShort className="w-5 h-5 text-green-500" />
              <p>Prev</p>
            </button>
          </Link>
        )}

        <MyTimer
          expiryTimestamp={time}
          timerType={timerType}
          setTimerType={setTimerType}
        />

        {!!nextEx.order.exercise_id ? (
          <Link
            href={`/sessions/${sessionId}/exercises/${nextEx.order.exercise_id}`}
          >
            <button
              disabled={!nextEx.order.exercise_id}
              className="flex flex-col justify-center items-center p-4 disabled:opacity-50"
            >
              <BsArrowRightShort className="w-5 h-5 text-green-500" />
              <p>Next</p>
            </button>
          </Link>
        ) : (
          <Link href={`/sessions/${sessionId}/end`}>
            <button
              disabled={nextEx.order.exercise_id === null}
              className="flex flex-col justify-center items-center p-4 disabled:opacity-50"
            >
              <BsArrowRightShort className="w-5 h-5 text-green-500" />
              <p>Next</p>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
