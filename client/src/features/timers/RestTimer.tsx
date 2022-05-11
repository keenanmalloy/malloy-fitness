import { useState } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsPlayCircle, BsStopwatch } from 'react-icons/bs';
import { TimerType } from './types';

interface Props {
  setTimerType: (timerType: TimerType) => void;
}

export const RestTimer = ({ setTimerType }: Props) => {
  const handleFocus = (event: any) => event.target.select();
  const [value, setValue] = useState({ min: 0, sec: '00' });

  const decrement = () => {
    if (value.min === 0 && value.sec === '00') {
      return;
    }

    if (value.sec === '15') {
      setValue({ min: value.min, sec: '00' });
    } else if (value.sec === '00') {
      setValue({
        min: value.min - 1,
        sec: `${value.sec === '00' ? 45 : +value.sec - 15}`,
      });
    } else {
      setValue({
        min: value.sec === '00' ? value.min - 1 : value.min,
        sec: `${value.sec === '00' ? 45 : +value.sec - 15}`,
      });
    }
  };

  const increment = () => {
    if (value.sec === '45') {
      setValue({ min: value.min + 1, sec: '00' });
    } else {
      setValue({ min: value.min, sec: `${+value.sec + 15}` });
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center pt-10">
        <h2>Rest Timer</h2>
        <button
          className="flex flex-col items-center"
          onClick={() => setTimerType(null)}
        >
          <BsStopwatch size={30} />
          <h2>Switch</h2>
        </button>
      </div>
      <div className="flex flex-col pt-5 pb-5 border-b-2 border-solid">
        <h2 className="flex justify-center">QUICK START</h2>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 0, sec: '30' })}
        >
          0:30
        </button>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 0, sec: '45' })}
        >
          0:45
        </button>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 1, sec: '00' })}
        >
          1:00
        </button>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 1, sec: '30' })}
        >
          1:30
        </button>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 2, sec: '00' })}
        >
          2:00
        </button>
        <button
          className=" pt-5"
          onClick={() => setValue({ min: 3, sec: '00' })}
        >
          3:00
        </button>
      </div>
      <h2 className="text-center py-5">CUSTOM</h2>
      <div className="flex justify-center">
        <button onClick={decrement} className="p-3">
          <AiOutlineMinusCircle size={30} />
        </button>
        <div className="flex space-x-1">
          <div className="flex border-2 border-solid relative w-14 h-14 rounded-md">
            <p className="absolute bottom-0 right-0.5 text-xs">m</p>
            <input
              type="number"
              onFocus={handleFocus}
              className="w-full text-center text-lg"
              value={value.min}
            />
          </div>
          <div className="flex border-2 border-solid relative w-14 h-14 rounded-md">
            <p className="absolute bottom-0 right-0.5 text-xs">s</p>
            <input
              type="number"
              onFocus={handleFocus}
              className="w-full text-center text-lg"
              value={value.sec}
            />
          </div>
        </div>
        <button onClick={increment} className="p-3">
          <AiOutlinePlusCircle size={30} />
        </button>
      </div>
      <div className="flex justify-center pt-5">
        <button>
          <BsPlayCircle size={50} />
        </button>
      </div>
    </div>
  );
};
