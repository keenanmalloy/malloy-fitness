import { BsPlayCircle, BsStopwatch } from 'react-icons/bs';
import { TimerType } from './types';

interface Props {
  setTimerType: (timerType: TimerType) => void;
}

export const CustomInterval = ({ setTimerType }: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center pt-10">
        <h2>Custom Interval</h2>
        <button
          className="flex flex-col items-center"
          onClick={() => setTimerType(null)}
        >
          <BsStopwatch size={30} />
          <h2>Switch</h2>
        </button>
      </div>
      <div className="text-center pt-10">
        <p>0 rounds of: </p>
        <p>0:00 work / 0:00 rest</p>
      </div>
      <div className="flex flex-col justify-center items-center pt-3">
        <div>
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <span>Rounds</span>
        </div>
        <div>
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <span>Work</span>
        </div>
        <div>
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <span>Rest</span>
        </div>
        <div>
          <input type="number" className="w-10 h-10 border-2 mx-1 my-1" />
          <span>Count In</span>
        </div>

        <button className="pt-5">
          <BsPlayCircle size={80} />
        </button>
      </div>
    </div>
  );
};
