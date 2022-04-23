import React, { useState } from 'react';
import { RiUser3Line, RiSearchLine } from 'react-icons/ri';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePreviewWorkoutsQuery } from 'features/date-scroll/usePreviewWorkoutsQuery';
import { generateCalendarState } from 'features/date-scroll/generateCalendarState';

const ScrollDatePicker = dynamic(
  import('../date-scroll/ScrollDatePicker').then((mod) => mod.ScrollDatePicker),
  { ssr: false }
);

export const HomeHeader = ({ selected, setSelected }) => {
  // state used to generate the array of calendar dates (+1 / -1 months)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(generateCalendarState(selectedDate));

  const { data, isError, isLoading } = usePreviewWorkoutsQuery({
    items,
    date: new Date(
      new Intl.DateTimeFormat('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(
        selected.id
          ? new Date(selected.year, selected.month - 1, selected.day)
          : new Date()
      )
    ).toISOString(),
  });

  return (
    <nav className="dark:bg-gray-900 p-2 bg-white shadow md:flex md:items-center md:justify-between md:p-6 fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-gray-300">
        <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
          <Link href="/profile">
            <button>
              <RiUser3Line
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>

          <Link href="/">
            <div className="flex">
              <h1 className="uppercase text-base">tr</h1>
              <h1 className="uppercase text-base text-gray-400">a</h1>
              <h1 className="uppercase text-base">ck</h1>
              <h1 className="uppercase text-base text-gray-400">e</h1>
              <h1 className="uppercase text-base">d</h1>
            </div>
          </Link>

          <Link href="/search">
            <button>
              <RiSearchLine
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>
        </div>
      </div>

      <ScrollDatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        items={items}
        setItems={setItems}
        selected={selected}
        setSelected={setSelected}
        data={data}
        isError={isError}
        isLoading={isLoading}
      />
    </nav>
  );
};
