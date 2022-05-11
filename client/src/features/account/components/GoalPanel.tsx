import { CustomInput } from 'features/form/CustomInput';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useGoalFieldMutation } from '../api/useGoalFieldMutation';
import { GetGoalsResponse } from '../types';

interface Props {
  goals: GetGoalsResponse['goals'];
}

export const GoalPanel = ({ goals }: Props) => {
  const [dailyStepGoal, setDailyStepGoal] = useState(goals.daily_steps_goal);
  const [bodyWeightGoal, setBodyWeightGoal] = useState(goals.body_weight_goal);
  const [weeklyCardioMinutes, setWeeklyCardioMinutes] = useState(
    goals.weekly_cardio_minutes_goal
  );

  return (
    <ul className="flex flex-col">
      <div className="p-5">
        <GoalField
          label={'Daily Steps'}
          type="number"
          onChange={(e) => setDailyStepGoal(+e.target.value)}
          value={dailyStepGoal}
          field="daily_steps_goal"
          placeholder="200"
          prevValue={goals.daily_steps_goal}
        />

        <GoalField
          label={'Body Weight'}
          type="number"
          onChange={(e) => setBodyWeightGoal(+e.target.value)}
          value={bodyWeightGoal}
          field="body_weight_goal"
          placeholder="10,000"
          prevValue={goals.body_weight_goal}
        />

        <GoalField
          label={'Weekly Cardio Minutes'}
          type="number"
          onChange={(e) => setWeeklyCardioMinutes(+e.target.value)}
          value={weeklyCardioMinutes}
          field="weekly_cardio_minutes_goal"
          placeholder="120"
          prevValue={goals.weekly_cardio_minutes_goal}
        />
      </div>
    </ul>
  );
};

interface AccountFieldProps {
  label: string;
  value: string | number;
  prevValue: string | number;
  field: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
}

export const GoalField = ({
  label,
  value,
  field,
  className,
  placeholder,
  type,
  onChange,
  prevValue,
  isTextArea,
}: AccountFieldProps) => {
  if (!field || !label) {
    throw new Error('field and label are required');
  }

  const { mutate, isLoading, isError } = useGoalFieldMutation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        mutate({
          payload: {
            [field]: value,
          },
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  return (
    <div className="flex-1">
      <CustomInput
        label={label}
        onChange={onChange}
        value={value}
        isLoading={isLoading}
        type={type}
        placeholder={placeholder}
      />
      {isError && (
        <div className="text-right w-full pb-1">
          <small className="text-red-600 text-xs">
            Error updating {label.toLowerCase()}
          </small>
        </div>
      )}
    </div>
  );
};
