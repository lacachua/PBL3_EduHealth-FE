import React, { useMemo, useRef, useState } from 'react';

const OTPInput = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}) => {
  const refs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const digits = useMemo(() => {
    const normalized = (value || '').slice(0, length);
    return Array.from({ length }, (_, idx) => normalized[idx] || '');
  }, [value, length]);

  const focusIndex = (index) => {
    refs.current[index]?.focus();
    refs.current[index]?.select();
    setActiveIndex(index);
  };

  const updateDigit = (digit, index) => {
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join(''));
  };

  const handleChange = (event, index) => {
    const inputValue = event.target.value.replace(/\D/g, '');

    if (!inputValue) {
      updateDigit('', index);
      return;
    }

    if (inputValue.length === 1) {
      updateDigit(inputValue, index);
      if (index < length - 1) {
        focusIndex(index + 1);
      }
      return;
    }

    const sliced = inputValue.slice(0, length);
    onChange(sliced);

    const nextFocusIndex = Math.min(sliced.length, length - 1);
    focusIndex(nextFocusIndex);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      focusIndex(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);

    const nextFocusIndex = Math.min(pasted.length, length - 1);
    focusIndex(nextFocusIndex);
  };

  return (
    <div className={`flex w-full items-center justify-center gap-2.5 sm:gap-3 ${hasError ? 'rounded-xl border border-auth-error/55 bg-auth-error-soft/35 p-2.5' : 'rounded-xl border border-auth-border bg-auth-surface-soft/45 p-2.5'}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onFocus={() => setActiveIndex(index)}
          onBlur={() => setActiveIndex(-1)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          aria-label={`OTP ${index + 1}`}
          className={`app-focus-ring h-[56px] w-[56px] rounded-xl border text-center text-xl font-semibold outline-none transition-[border-color,background-color,box-shadow,color] duration-200 ease-out sm:h-[62px] sm:w-[62px] ${
            hasError
              ? 'border-auth-error bg-auth-error-soft/45 text-auth-error focus:border-auth-error focus:ring-2 focus:ring-auth-error/30'
              : activeIndex === index
                ? 'border-auth-primary bg-auth-surface text-auth-text-strong ring-2 ring-auth-primary/30'
                : 'border-auth-border bg-auth-surface text-auth-text-strong focus:border-auth-primary focus:ring-2 focus:ring-auth-primary/30'
          } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
