import { AiOutlinePauseCircle } from 'react-icons/ai';
import { BsPlayCircle, BsStopwatch } from 'react-icons/bs';
import { GrPowerReset } from 'react-icons/gr';
import { TimerType } from './types';

interface Props {
  setTimerType: (timerType: TimerType) => void;
}

export const Stopwatch = ({ setTimerType }: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center pt-10">
        <h2>Stopwatch</h2>
        <button
          className="flex flex-col items-center"
          onClick={() => setTimerType(null)}
        >
          <BsStopwatch size={30} />
          <h2>Switch</h2>
        </button>
      </div>
      <div className="flex justify-center pt-14">
        <button>
          <BsPlayCircle size={300} />
        </button>
      </div>
      <div className="flex items-center justify-center pt-10">
        <h2>Count in</h2>
        <input type="number" className="border-2 h-10 w-10 mx-2" />
      </div>
      <div className="flex justify-center pt-5">
        <button className="mx-5">
          <GrPowerReset size={50} />
        </button>
        <button className="mx-5">
          <AiOutlinePauseCircle size={50} />
        </button>
      </div>
    </div>
  );
};
