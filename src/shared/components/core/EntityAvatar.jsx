import React from 'react';

const EntityAvatar = ({
  name,
  imageUrl,
  sizeClass = 'h-10 w-10',
  textClass = 'text-xs',
  borderClass = 'border border-primary-soft',
  backgroundClass = 'bg-primary-soft text-primary',
}) => {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || 'avatar'}
        className={`${sizeClass} rounded-full ${borderClass} object-cover`}
      />
    );
  }

  return (
    <span
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full ${borderClass} ${backgroundClass} ${textClass} font-bold`}
    >
      {initials}
    </span>
  );
};

export default EntityAvatar;