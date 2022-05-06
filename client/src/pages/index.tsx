import React, { useState } from 'react';

import { HomeHeader } from 'features/common/HomeHeader';
import Navbar from 'features/common/Navbar';

import { GetSelectedDailyOverview } from 'features/daily/GetSelectedDailyOverview';

function HomePage() {
  // the day selected by the user
  const [selected, setSelected] = useState({});

  return (
    <main>
      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '40px' }} />
      <HomeHeader selected={selected} setSelected={setSelected} />

      <GetSelectedDailyOverview selected={selected} />

      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '70px' }} />
      <Navbar />
    </main>
  );
}

export default HomePage;
