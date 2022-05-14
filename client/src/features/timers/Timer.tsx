import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import FullPageModal from 'features/modal/FullPageModal';
import { MdOutlineTimer } from 'react-icons/md';
import { BiX } from 'react-icons/bi';
import { Timers } from './Timers';
import { RestTimer } from './RestTimer';
import { TimerType } from './types';
import { CustomInterval } from './CustomInterval';
import { Stopwatch } from './Stopwatch';

interface Props {
  timerType: TimerType;
  setTimerType: (timerType: TimerType) => void;
  expiryTimestamp: Date;
}

export const MyTimer = ({
  expiryTimestamp,
  timerType,
  setTimerType,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  return (
    <div>
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center"
        >
          <MdOutlineTimer size={20} onClick={() => setIsOpen(true)} />
          <span className="text-sm">Select Timer</span>
        </button>
      </div>

      <FullPageModal
        isOpen={isOpen}
        title=""
        description=""
        closeModal={() => setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-0 right-0 p-3 text-2xl"
        >
          <BiX />
        </button>
        {timerSwaper(timerType, setTimerType)}

        {/* <RestTimer />  */}
        {/* <Stopwatch/> */}
        {/* <CustomInterval/> */}
      </FullPageModal>
    </div>
  );
};

const timerSwaper = (
  timerType: TimerType,
  setTimerType: (timerType: TimerType) => void
) => {
  switch (timerType) {
    case 'rest':
      return <RestTimer setTimerType={setTimerType} />;
    case 'stopwatch':
      return <Stopwatch setTimerType={setTimerType} />;
    case 'interval':
      return <CustomInterval setTimerType={setTimerType} />;
    default:
      return <Timers setTimerType={setTimerType} />;
  }
};

{
  /* <div style={{ fontSize: '25px' }}>
<span>{minutes}</span>:<span>{seconds}</span>
</div>
<p>{isRunning ? 'Running' : 'Not running'}</p>
<button onClick={start}>Start</button>
<button onClick={pause}>Pause</button>
<button onClick={resume}>Resume</button>
<button
onClick={() => {
  // Restarts to 5 minutes timer
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  restart(time);
}}
>
Restart
</button> */
}
