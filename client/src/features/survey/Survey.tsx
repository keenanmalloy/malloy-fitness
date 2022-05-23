import { Header } from 'features/common/Header';
import { useUpdateSessionMutation } from 'features/sessions/useUpdateSessionMutation';
import React, { useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { BiBrain } from 'react-icons/bi';
import { BsLightningCharge } from 'react-icons/bs';
import { GiBiceps, GiNightSleep } from 'react-icons/gi';
import { IoRainyOutline } from 'react-icons/io5';
import { useQueryClient } from 'react-query';
import { SurveyButton } from './SurveyButton';
import { SurveyFooter } from './SurveyFooter';

export interface ReadinessData {
  readiness_energy: number | null;
  readiness_mood: number | null;
  readiness_stress: number | null;
  readiness_soreness: number | null;
  readiness_sleep: number | null;
}

interface Props {
  sessionId: string;
  data: ReadinessData;
  firstTaskId: string;
}

export const Survey = ({ sessionId, data, firstTaskId }: Props) => {
  return (
    <main className="py-5 bg-slate-900 min-h-screen">
      <Header />
      <div className="h-10" />
      <SurveyComponent
        icon={BsLightningCharge}
        values={['wiped', 'tired', 'okay', 'great', 'amped']}
        type="energy"
        sessionId={sessionId}
        data={data}
      />

      <SurveyComponent
        icon={IoRainyOutline}
        values={['very poor', 'poor', 'okay', 'great', 'amazing']}
        type="mood"
        sessionId={sessionId}
        data={data}
      />

      <SurveyComponent
        icon={GiNightSleep}
        values={['awful', 'poor', 'okay', 'great', 'excellent']}
        type="sleep"
        sessionId={sessionId}
        data={data}
      />

      <SurveyComponent
        icon={GiBiceps}
        values={[
          'very sore',
          'pretty sore',
          'moderate',
          'little soreness',
          'no soreness',
        ]}
        type="soreness"
        sessionId={sessionId}
        data={data}
      />

      <SurveyComponent
        icon={BiBrain}
        values={['very stressed', 'stressed', 'okay', 'not much', 'relaxed']}
        type="stress"
        sessionId={sessionId}
        data={data}
      />

      <SurveyFooter
        data={data}
        firstTaskId={firstTaskId}
        sessionId={sessionId}
      />
    </main>
  );
};

interface SurveyComponentProps {
  icon: IconType;
  type: 'energy' | 'mood' | 'sleep' | 'soreness' | 'stress';
  values: string[];
  sessionId: string;
  data: ReadinessData;
}

const SurveyComponent = ({
  icon,
  type,
  values,
  sessionId,
  data,
}: SurveyComponentProps) => {
  const [selectedColor, setSelectedColor] = useState(
    !!data[`readiness_${type}`]
      ? getBgColorByKey(data[`readiness_${type}`] as number)
      : ''
  );

  const { mutate, isLoading, isError } = useUpdateSessionMutation(sessionId);
  const queryClient = useQueryClient();

  const handleButtonClick = (color: string, value: number) => {
    setSelectedColor(color);
    mutate(
      {
        payload: { [`readiness_${type}`]: value },
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchSession');
          executeScroll();
        },
      }
    );
  };

  const ref = useRef<HTMLDivElement | null>(null);

  const executeScroll = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id={type} className="pb-20" ref={ref}>
      <div className="px-2 uppercase text-white">
        <h2>Pre Session Readiness</h2>
        <h1 className="text-xl">{type}</h1>
      </div>

      <div className="flex justify-center items-center h-64">
        {icon({
          size: 150,
          className: selectedColor.replace('bg-', 'text-') || 'text-white',
        })}
      </div>
      <div>
        <div className="flex justify-between space-x-1 px-1">
          {values.map((value, index) => {
            return (
              <SurveyButton
                number={index + 1}
                text={value}
                onClick={() =>
                  handleButtonClick(getBgColorByKey(index + 1), index + 1)
                }
                textColor={
                  selectedColor === getBgColorByKey(index + 1)
                    ? 'text-black'
                    : getTextColorByKey(index + 1)
                }
                bgColor={
                  selectedColor === getBgColorByKey(index + 1)
                    ? getBgColorByKey(index + 1)
                    : 'bg-transparent'
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const getBgColorByKey = (key: number) => {
  switch (key) {
    case 1:
      return 'bg-red-700';
    case 2:
      return 'bg-red-500';
    case 3:
      return 'bg-orange-500';
    case 4:
      return 'bg-green-600';
    case 5:
      return 'bg-green-400';
    default:
      return 'bg-white';
  }
};

const getTextColorByKey = (key: number) => {
  switch (key) {
    case 1:
      return 'text-red-700';
    case 2:
      return 'text-red-500';
    case 3:
      return 'text-orange-500';
    case 4:
      return 'text-green-600';
    case 5:
      return 'text-green-500';
    default:
      return 'text-white';
  }
};
