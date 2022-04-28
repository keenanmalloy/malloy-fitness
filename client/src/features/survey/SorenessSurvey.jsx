import React from 'react';
import Layout from 'features/common/Layout';
import { GiBiceps } from 'react-icons/gi';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { useRouter } from 'next/router';

const Soreness = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/check-in/readiness/sleep');
  };
  return (
    <Layout>
      <h2>Pre Session Readiness</h2>
      <h1>Soreness</h1>
      <div className="flex justify-center items-center h-64">
        <GiBiceps size={150} />
      </div>
      <form>
        <div className="flex justify-between space-x-1 px-1">
          <SurveyButton number={1} text="Awful" color="text-red-700" />
          <SurveyButton number={2} text="Poor" color="text-red-500" />
          <SurveyButton number={3} text="Okay" color="text-orange-500" />
          <SurveyButton number={4} text="Great" color="text-green-600" />
          <SurveyButton number={5} text="Excellent" color="text-green-500" />
        </div>
      </form>
      <footer className="w-full">
        <div className="absolute bottom-16 flex justify-between items-center bg-slate-800 text-white right-0 left-0 ">
          <button className="p-4 ">
            <IoMdArrowBack onClick={handleBackClick} />
          </button>
          <div>Completed 0 / 5</div>
          <button className="p-4 ">
            <IoMdArrowForward />
          </button>
        </div>
      </footer>
    </Layout>
  );
};

export default Soreness;

function SurveyButton({ number, text, color }) {
  return (
    <button
      className={`h-12 w-1/5 border-solid border-2 border-slate-500 flex flex-col justify-center items-center ${color}`}
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
