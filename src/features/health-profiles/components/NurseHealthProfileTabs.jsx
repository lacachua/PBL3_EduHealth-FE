import React from 'react';

const NurseHealthProfileTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <section className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
      <div className="flex min-w-max gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`app-focus-ring rounded-lg px-3 py-1.5 text-sm font-semibold transition-[background-color,color,box-shadow,border-color] duration-180 ease-out ${
                isActive
                  ? 'bg-[#DCFCE7] text-[#166534] shadow-[inset_0_0_0_1px_rgba(21,128,61,0.35)]'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default NurseHealthProfileTabs;
