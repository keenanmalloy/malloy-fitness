import React from 'react';
import { GetDailyResponse } from './types';

interface Props {
  data: GetDailyResponse;
}

export const HealthPanel = ({ data }: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center pt-5">
        <div>
          blood <span className="flex">pressure: 120/60</span>{' '}
        </div>
        <div>
          resting <span className="flex">heart rate: 63 bpm</span>{' '}
        </div>
        <div>
          blood <span className="flex">glucose: 78mg/dL</span>{' '}
        </div>
      </div>
    </div>
  );
};
