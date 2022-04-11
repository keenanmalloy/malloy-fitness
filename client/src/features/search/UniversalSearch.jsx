import React, { useState } from 'react';
import { Input } from 'features/form/Input';

export const UniversalSearch = () => {
  const [query, setQuery] = useState('');

  return (
    <Input
      onChange={(e) => setQuery(e.target.value)}
      value={query}
      label="search"
      isRequired
      type="search"
    />
  );
};
