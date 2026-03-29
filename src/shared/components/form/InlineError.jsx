import React from 'react';

const InlineError = ({ message }) => {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-[#B85C57]">{message}</p>;
};

export default InlineError;
