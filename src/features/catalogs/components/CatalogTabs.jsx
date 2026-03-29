import React from 'react';
import { CATALOG_GROUPS } from '../schemas/catalogManagementSchema';

const CatalogTabs = ({ activeGroup, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    {CATALOG_GROUPS.map((group) => (
      <button
        key={group.value}
        type="button"
        onClick={() => onChange(group.value)}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          activeGroup === group.value
            ? 'border-secondary bg-secondary-container text-secondary'
            : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        {group.label}
      </button>
    ))}
  </div>
);

export default CatalogTabs;
