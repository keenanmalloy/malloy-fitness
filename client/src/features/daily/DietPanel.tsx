import React, { useEffect, useState, useRef } from 'react';
import { GetDailyResponse } from './types';

interface DietPanelProps {
  data: GetDailyResponse;
}

export const DietPanel = ({ data }: DietPanelProps) => {
  const [calories, setCalories] = useState(22);
  const [protein, setProtein] = useState(44);
  const [fats, setFats] = useState(55);
  const [carbs, setCarbs] = useState(77);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="border-b border-slate-400"></div>
      <div className="flex justify-center">
        <DietStatistic progress={calories} />
        <DietStatistic progress={protein} size="small" label="Protein" />
        <DietStatistic progress={fats} size="small" label="Fats" />
        <DietStatistic progress={carbs} size="small" label="Carbs" />
      </div>
    </div>
  );
};

interface DietStatisticProps {
  progress: number;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

const DietStatistic = ({ progress, size, label }: DietStatisticProps) => {
  if (size === 'small') {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center relative p-1">
          <div className="w-12 h-12 rounded-full flex flex-col justify-center items-center bg-slate-900 text-gray-200 text-xs">
            <div className="text-white">{progress}g</div>
          </div>
          <ProgressBar
            progress={progress}
            size={52}
            strokeWidth={9}
            circleOneStroke="#f0fdf4"
            circleTwoStroke={'#4ade80'}
            top={'-18'}
          />
        </div>
        <label
          style={{
            fontSize: '0.6rem',
          }}
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="flex justify-center relative p-2">
      <div className="w-20 h-20 rounded-full flex flex-col justify-center items-center bg-slate-900 text-gray-200 text-xs">
        <div className="text-white">800</div>
        <label style={{ fontSize: '0.6rem' }}>Calories</label>
      </div>
      <ProgressBar
        progress={progress}
        size={88}
        strokeWidth={9}
        circleOneStroke="#f0fdf4"
        circleTwoStroke={'#4ade80'}
        top={'-16'}
      />
    </div>
  );
};

interface ProgressBarProps {
  progress: number;
  size: number;
  strokeWidth: number;
  circleOneStroke: string;
  circleTwoStroke: string;
  top?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  const [offset, setOffset] = useState(302);
  const circleRef = useRef<SVGCircleElement>(null);
  const { size, progress, strokeWidth, circleOneStroke, circleTwoStroke, top } =
    props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);

    // @ts-ignore
    circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';
  }, [setOffset, progress, circumference, offset]);

  return (
    <svg
      className="svg"
      width={size}
      height={size}
      style={{
        display: 'block',
        margin: '20px auto',
        maxWidth: '100%',
        position: 'absolute',
        zIndex: '-1',
        top: top,
        bottom: '0',
      }}
    >
      <circle
        className="svg-circle-bg"
        style={{
          fill: 'none',
        }}
        stroke={circleOneStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="svg-circle"
        style={{
          fill: 'none',
        }}
        ref={circleRef}
        stroke={circleTwoStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};
