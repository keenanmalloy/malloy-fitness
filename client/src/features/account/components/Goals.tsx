import React, { useState } from 'react';
import { AccountField } from './AccountField';

export const Goals = () => {
  const [dailyStepGoal, setDailyStepGoal] = useState('');
  return (
    <div>
      <AccountField
        label={'Daily Steps'}
        type="number"
        onChange={(e) => setDailyStepGoal(e.target.value)}
        value={dailyStepGoal}
        field="daily_step_goal"
        placeholder="10,000"
        prevValue={''} // prevValue={account.daily_step_goal}
      />
    </div>
  );
};
