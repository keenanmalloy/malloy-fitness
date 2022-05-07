import React, { FormEvent } from 'react';
import { Range } from 'react-range';
import { useState } from 'react';

function SleepPage() {
  const [values, setValues] = useState([0]);
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const sleepStats = {
      duration: parseInt(duration),
      rating: parseInt(rating),
      quality: values[0],
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sleep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sleepStats),
      credentials: 'include',
    });
    const json = await res.json();
    return json;
  };
  return (
    <div>
      <div className="w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-center mb-5 text-lg">
            Good morning, how was your sleep?
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-center"
              htmlFor="Hours"
            >
              Sleep Duration (hours:minutes)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Hours"
              type="number"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-center"
              htmlFor="Sleep Rating"
            >
              Sleep Rating (1-5)
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Sleep Rating"
              placeholder="Select a rating"
              value={rating}
              required
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="" disabled>
                Select a rating
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-center"
              htmlFor="Sleep Quality"
            >
              Sleep Quality % (if using a sleep tracker)
            </label>
            <span className="">{values[0]}%</span>
            <Range
              step={1}
              min={0}
              max={100}
              values={values}
              onChange={(values) => {
                setValues(values);
              }}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="w-5 h-5 transform translate-x-10 bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Skip
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SleepPage;
