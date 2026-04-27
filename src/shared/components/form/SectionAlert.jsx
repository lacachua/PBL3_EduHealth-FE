const toneClassMap = {
  info: 'border-info/30 bg-info-soft text-info',
  warning: 'border-warning/30 bg-warning-soft text-warning',
  error: 'border-danger/30 bg-danger-soft text-danger',
};

const SectionAlert = ({ message, tone = 'info' }) => {
  if (!message) return null;

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${toneClassMap[tone] || toneClassMap.info}`}>
      {message}
    </div>
  );
};

export default SectionAlert;
