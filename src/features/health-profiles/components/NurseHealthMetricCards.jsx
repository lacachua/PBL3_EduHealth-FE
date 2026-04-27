const cards = [
  { id: 'height', label: 'Chiều cao', icon: 'straighten', unit: 'cm', key: 'height' },
  { id: 'weight', label: 'Cân nặng', icon: 'weight', unit: 'kg', key: 'weight' },
  { id: 'bmi', label: 'BMI', icon: 'monitor_heart', unit: 'kg/m²', key: 'bmi' },
  { id: 'blood', label: 'Nhóm máu', icon: 'bloodtype', unit: '', key: 'bloodType' },
];

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '--';
  }
  return value;
};

const NurseHealthMetricCards = ({ metrics }) => {
  return (
    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.id} className="app-card-shell flex h-full flex-col justify-between rounded-xl px-3.5 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-success-soft text-success">
              <span className="material-symbols-outlined text-[17px]">{card.icon}</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{card.label}</span>
          </div>

          <div className="flex items-end gap-1.5">
            <p className="text-[1.4rem] font-extrabold leading-none text-on-surface">{formatValue(metrics?.[card.key])}</p>
            {(card.unit && formatValue(metrics?.[card.key]) !== '--') ? <span className="pb-0.5 text-[11px] font-medium text-on-surface-variant">{card.unit}</span> : null}
          </div>

          <div className="mt-auto pt-1">
            <p className="text-[11px] text-on-surface-variant">{card.id === 'bmi' ? (metrics?.note || '--') : 'Cập nhật từ hồ sơ sức khỏe hiện tại'}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default NurseHealthMetricCards;
