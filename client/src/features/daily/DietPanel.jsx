import React, { useEffect, useState, useRef } from 'react';

export const DietPanel = () => {
  const [calories, setCalories] = useState(22);
  const [protein, setProtein] = useState(44);
  const [fats, setFats] = useState(55);
  const [carbs, setCarbs] = useState(77);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-2xl text-slate-600 pt-28">Nutrition</div>
      <div className="border-b border-slate-400">
        <DietStatistic progress={calories} />
      </div>
      <div className="flex justify-center">
        <DietStatistic progress={protein} size="small" label="Protein" />
        <DietStatistic progress={fats} size="small" label="Fats" />
        <DietStatistic progress={carbs} size="small" label="Carbs" />
      </div>
    </div>
  );
};

const DietStatistic = ({ progress, size, label }) => {
  if (size === 'small') {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center relative p-2">
          <div className="w-16 h-16 rounded-full flex flex-col justify-center items-center bg-slate-900 text-gray-200">
            <div className="text-white py-1">{progress}g</div>
          </div>
          <ProgressBar
            progress={progress}
            size={70}
            strokeWidth={9}
            circleOneStroke="#f0fdf4"
            circleTwoStroke={'#4ade80'}
            top={'-15'}
          />
        </div>
        <label>{label}</label>
      </div>
    );
  }

  return (
    <div className="flex justify-center relative p-2">
      <div className="w-24 h-24 rounded-full flex flex-col justify-center items-center bg-slate-900 text-gray-200">
        <div className="text-white py-1">800</div>
        <label>Calories</label>
      </div>
      <ProgressBar
        progress={progress}
        size={105}
        strokeWidth={9}
        circleOneStroke="#f0fdf4"
        circleTwoStroke={'#4ade80'}
        top={'-16'}
      />
    </div>
  );
};

const ProgressBar = (props) => {
  const [offset, setOffset] = useState(302);
  const circleRef = useRef(null);
  const { size, progress, strokeWidth, circleOneStroke, circleTwoStroke, top } =
    props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);

    circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';
  }, [setOffset, progress, circumference, offset]);

  return (
    <>
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
    </>
  );
};
