import { AiOutlineClockCircle } from 'react-icons/ai';
import { CgCalendarDates } from 'react-icons/cg';
import { FaWeightHanging, FaRegTired } from 'react-icons/fa';
import { GiTrafficLightsReadyToGo } from 'react-icons/gi';

interface SessionEndStatsProps {
  endedAt: string | null;
}

export const SessionEndStats = ({ endedAt }: SessionEndStatsProps) => {
  if (!endedAt) return null;
  return (
    <>
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
    </>
  );
};
