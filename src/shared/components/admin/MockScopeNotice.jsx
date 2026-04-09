import React from 'react';

const MockScopeNotice = ({
  moduleLabel,
  className = '',
  message,
}) => {
  const defaultMessage = moduleLabel
    ? `${moduleLabel} hiện đang ở chế độ demo (mock-only), thuộc phạm vi deferred và chờ backend chính thức.`
    : 'Module hiện đang ở chế độ demo (mock-only), thuộc phạm vi deferred và chờ backend chính thức.';

  return (
    <section className={`rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning ${className}`.trim()}>
      <p className="font-semibold">Phạm vi demo nội bộ</p>
      <p className="mt-1 text-[13px] leading-5">{message || defaultMessage}</p>
    </section>
  );
};

export default MockScopeNotice;