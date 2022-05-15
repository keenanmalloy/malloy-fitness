import React, { useState } from 'react';
import { RiUser3Line, RiSearchLine } from 'react-icons/ri';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePreviewWorkoutsQuery } from 'features/date-scroll/usePreviewWorkoutsQuery';
import { generateCalendarState } from 'features/date-scroll/generateCalendarState';
import { SelectedDate } from 'features/daily/types';
import { BiCog } from 'react-icons/bi';
import { Logo } from './Logo';

const ScrollDatePicker = dynamic(
  // @ts-ignore
  import('../date-scroll/ScrollDatePicker').then((mod) => mod.ScrollDatePicker),
  { ssr: false }
);

interface Props {
  selected: SelectedDate;
  setSelected: (date: SelectedDate) => void;
}

export const HomeHeader = ({ selected, setSelected }: Props) => {
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
          <Link href="/settings">
            <button>
              <BiCog
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>
          </Link>

          <Link href="/">
            <a className="flex items-center justify-center ">
              <Logo className="w-4 fill-green-500 " />
              <div className="flex text-lg px-1">
                <h1 className="uppercase">tr</h1>
                <h1 className="uppercase">a</h1>
                <h1 className="uppercase">ck</h1>
                <h1 className="uppercase">e</h1>
                <h1 className="uppercase">d</h1>
              </div>
            </a>
          </Link>

          <div />
        </div>
      </div>

      <ScrollDatePicker
        // @ts-ignore
        items={items}
        setItems={setItems}
        selected={selected}
        setSelected={setSelected}
        data={data}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </nav>
  );
};
