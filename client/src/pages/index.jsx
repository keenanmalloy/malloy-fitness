import React, { useState } from 'react';

import { HomeHeader } from 'features/common/HomeHeader';
import Navbar from 'features/common/Navbar';
import { Overview } from 'features/common/Overview';

function HomePage() {
  // the day selected by the user
  const [selected, setSelected] = useState({});

  return (
    <main>
      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '40px' }} />
      <HomeHeader selected={selected} setSelected={setSelected} />

      <section className="flex w-100 items-center justify-center">
        <div className="max-w-xl flex-1">
          <Overview selected={selected} />
        </div>
      </section>

      {/* Empty div to cover the height of the navbar */}
      <div style={{ height: '70px' }} />
      <Navbar />
    </main>
  );
}

export default HomePage;
