import { BsStopwatch } from 'react-icons/bs';
import { IoIosTimer } from 'react-icons/io';
import { MdTimer10 } from 'react-icons/md';
import { TimerType } from './types';

interface Props {
  setTimerType: (timerType: TimerType) => void;
}

export const Timers = ({ setTimerType }: Props) => {
  return (
    <div>
      <div className="flex justify-around py-24">
        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setTimerType('rest')}
        >
          <IoIosTimer size={50} />
          <span className="pt-2">Rest Timer</span>
        </button>
        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setTimerType('stopwatch')}
        >
          <BsStopwatch size={50} />
          <span className="pt-2">Stopwatch</span>
        </button>
      </div>
      <div className="flex justify-around">
        {/* <button className="flex flex-col justify-center items-center">
            <GiBiceps size={50} />
            <span className="pt-2">Muscle Round</span>
          </button> */}
        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setTimerType('interval')}
        >
          <MdTimer10 size={50} />
          <span className="pt-2">Custom Interval</span>
        </button>
      </div>
    </div>
  );
};
