import React, { useState } from 'react';
import { HomeHeader } from 'features/common/HomeHeader';
import Navbar from 'features/common/Navbar';
import { GetSelectedDailyOverview } from 'features/daily/GetSelectedDailyOverview';
import { SelectedDate } from 'features/daily/types';

function HomePage() {
  // the day selected by the user
  const [selected, setSelected] = useState<SelectedDate | {}>({});

  return (
    <main className="bg-slate-900 min-h-screen ">
      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '40px' }} />
      <HomeHeader
        selected={selected as SelectedDate}
        setSelected={setSelected}
      />

      <GetSelectedDailyOverview selected={selected as SelectedDate} />

      {/* Empty div to cover the height of the navbar. */}
      <div style={{ height: '70px' }} />
      <Navbar />
    </main>
  );
}

export default HomePage;
