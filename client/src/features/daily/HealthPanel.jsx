import React from 'react';

export const HealthPanel = ({ data }) => {
  return (
    <div>
      <div className="flex justify-between items-center pt-5">
        <div>
          blood <span className="flex">pressure: 120/60</span>{' '}
          {data.blood_pressure}
        </div>
        <div>
          resting <span className="flex">heart rate: 63 bpm</span>{' '}
          {data.resting_heart_rate}
        </div>
        <div>
          blood <span className="flex">glucose: 78mg/dL</span>{' '}
          {data.blood_glucose}
        </div>
      </div>
    </div>
  );
};
