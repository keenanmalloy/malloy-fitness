import React, { useState } from 'react';
import Layout from 'features/common/Layout';
import { GiBiceps } from 'react-icons/gi';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { useRouter } from 'next/router';

const Soreness = () => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState();

  const handleButtonClick = (color) => {
    setSelectedColor(color);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const handleBackClick = () => {
    router.push('/check-in/readiness/sleep');
  };

  const handleNextClick = () => {
    router.push('/check-in/readiness/stress');
  };
  return (
    <Layout>
      <h2>Pre Session Readiness</h2>
      <h1>Soreness</h1>
      <div className="flex justify-center items-center h-64">
        <GiBiceps
          size={150}
          className={selectedColor.replace('bg-', 'text-')}
        />
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between space-x-1 px-1">
          <SurveyButton
            number={1}
            text="Very sore"
            onClick={() => handleButtonClick('bg-red-700')}
            textColor={
              selectedColor === 'bg-red-700' ? 'text-black' : 'text-red-700'
            }
            bgColor={selectedColor === 'bg-red-700' ? 'bg-red-700' : 'bg-white'}
          />
          <SurveyButton
            number={2}
            text="Pretty sore"
            onClick={() => handleButtonClick('bg-red-500')}
            textColor={
              selectedColor === 'bg-red-500' ? 'text-black' : 'text-red-500'
            }
            bgColor={selectedColor === 'bg-red-500' ? 'bg-red-500' : 'bg-white'}
          />
          <SurveyButton
            number={3}
            text="Moderate"
            onClick={() => handleButtonClick('bg-orange-500')}
            textColor={
              selectedColor === 'bg-orange-500'
                ? 'text-black'
                : 'text-orange-500'
            }
            bgColor={
              selectedColor === 'bg-orange-500' ? 'bg-orange-500' : 'bg-white'
            }
          />
          <SurveyButton
            number={4}
            text="Little soreness"
            onClick={() => handleButtonClick('bg-green-600')}
            textColor={
              selectedColor === 'bg-green-600' ? 'text-black' : 'text-green-600'
            }
            bgColor={
              selectedColor === 'bg-green-600' ? 'bg-green-600' : 'bg-white'
            }
          />
          <SurveyButton
            number={5}
            text="No soreness"
            onClick={() => handleButtonClick('bg-green-500')}
            textColor={
              selectedColor === 'bg-green-500' ? 'text-black' : 'text-green-500'
            }
            bgColor={
              selectedColor === 'bg-green-500' ? 'bg-green-500' : 'bg-white'
            }
          />
        </div>
      </form>
      <footer className="w-full">
        <div className="absolute bottom-16 flex justify-between items-center bg-slate-800 text-white right-0 left-0 ">
          <button className="p-4 " onClick={handleBackClick}>
            <IoMdArrowBack />
          </button>
          <div>Completed 0 / 5</div>
          <button className="p-4 " onClick={handleNextClick}>
            <IoMdArrowForward />
          </button>
        </div>
      </footer>
    </Layout>
  );
};

export default Soreness;

function SurveyButton({ number, text, textColor, bgColor, onClick }) {
  return (
    <button
      className={`h-12 w-1/5 border-solid border-2 border-slate-500 flex flex-col justify-center items-center ${textColor} ${bgColor}`}
      onClick={onClick}
    >
      <p>{number}</p>
      <span
        className="flex "
        style={{
          fontSize: '0.7rem',
        }}
      >
        {text}
      </span>
    </button>
  );
}
