import React from 'react';

const RetryState = ({ title, description, onRetry, retryLabel = 'Thử lại' }) => {
  return (
    <div className="rounded-lg border border-[#D8E3DE] bg-[#FBFCFB] p-5 text-center">
      <h4 className="text-base font-semibold text-[#1F2A27]">{title}</h4>
      <p className="mt-1 text-sm text-[#5E6F69]">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-md border border-[#D8E3DE] bg-[#F7FAF8] px-3 py-1.5 text-sm font-semibold text-[#42534D] transition hover:bg-[#EEF4F1]"
      >
        {retryLabel}
      </button>
    </div>
  );
};

export default RetryState;
