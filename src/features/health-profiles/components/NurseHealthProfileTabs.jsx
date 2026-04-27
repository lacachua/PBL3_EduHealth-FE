const NurseHealthProfileTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <section className="overflow-x-auto rounded-xl border border-outline-variant bg-white p-1.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
      <div className="flex min-w-max gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`app-focus-ring rounded-lg px-3 py-1.5 text-sm font-semibold transition-[background-color,color,box-shadow,border-color] duration-180 ease-out ${isActive
                  ? 'bg-success-soft text-success shadow-[inset_0_0_0_1px_rgba(21,128,61,0.35)]'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
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
