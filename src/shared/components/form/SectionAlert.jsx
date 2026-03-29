import React from 'react';

const toneClassMap = {
  info: 'border-[#D8E7DE] bg-[#F4FAF7] text-[#486157]',
  warning: 'border-[#E7DFCC] bg-[#FFF9EC] text-[#74633D]',
  error: 'border-[#E8D5D2] bg-[#FEF6F5] text-[#8A4D49]',
};

const SectionAlert = ({ message, tone = 'info' }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${toneClassMap[tone] || toneClassMap.info}`}>
      {message}
    </div>
  );
};

export default SectionAlert;
