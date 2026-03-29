import React from 'react';

const FilterBar = ({ children }) => (
  <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">{children}</div>
);

export default FilterBar;
