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
    <nav className="dark:bg-gray-900 p-2 bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="max-w-2xl mx-auto px-2 text-gray-300">
        <div className="flex-1 flex items-center justify-between">
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
            <div className="flex text-lg">
              <h1 className="uppercase">tr</h1>
              <h1 className="uppercase">a</h1>
              <h1 className="uppercase">ck</h1>
              <h1 className="uppercase">e</h1>
              <h1 className="uppercase">d</h1>
            </div>
          </Link>

          <div />
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
