import React from 'react';
import { CATALOG_GROUPS } from '../schemas/catalogManagementSchema';

const CatalogGroupTabs = ({ activeGroup, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    {CATALOG_GROUPS.map((group) => (
      <button
        key={group.value}
        type="button"
        onClick={() => onChange(group.value)}
        aria-pressed={activeGroup === group.value}
        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 ${
          activeGroup === group.value
            ? 'border-secondary/45 bg-secondary-container/45 text-secondary shadow-[inset_0_0_0_1px_rgba(42,71,156,0.15)]'
            : 'border-outline-variant bg-surface text-on-surface-variant hover:border-secondary/20 hover:bg-surface-container-low'
        }`}
      >
        {group.label}
      </button>
    ))}
  </div>
);

export default CatalogGroupTabs;
