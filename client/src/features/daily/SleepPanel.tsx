import React from 'react';
import { GetDailyResponse } from './types';

interface Props {
  data: GetDailyResponse;
}

export const SleepPanel = ({ data }: Props) => {
  return (
    <div>
      <div className="flex justify-center text-center mx-3 py-2">
        7/10 hours Sleep Today
      </div>
    </div>
  );
};
