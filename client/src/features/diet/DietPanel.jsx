import React from 'react';

export const DietPanel = () => {
  return (
    <div className="border-b border-slate-400 pt-5">
      <div className="h-32 flex justify-center pt-4 mt-20">
        <div className="w-24 h-24 rounded-full flex flex-col justify-center items-center bg-slate-900 text-slate-400">
          <div className="text-white py-1">0</div>
          Calories
        </div>
      </div>
      <div className="flex justify-center border-b-2 border-solid rounded-sm border-slate-400 mx-3 pb-4">
        <div className="flex flex-col text-center text-slate-600">
          <div className="w-14 h-14 rounded-full flex justify-center items-center bg-slate-900 text-white">
            0%
          </div>
          Protein
          <div>0g</div>
        </div>
        <div className="flex flex-col text-center text-slate-600">
          <div className="mx-14 w-14 h-14 rounded-full flex justify-center items-center bg-slate-900 text-white">
            0%
          </div>
          Carbs
          <div>0g</div>
        </div>
        <div className="flex flex-col text-center text-slate-600">
          <div className="w-14 h-14 rounded-full flex justify-center items-center bg-slate-900 text-white">
            0%
          </div>
          Fats
          <div>0g</div>
        </div>
      </div>
    </div>
  );
};
