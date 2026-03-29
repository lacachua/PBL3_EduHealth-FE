import React from 'react';

const TableToolbar = ({ filters, actions }) => (
  <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">{filters}</div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export default TableToolbar;
