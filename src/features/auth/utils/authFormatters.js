export const maskEmail = (value = '') => {
  const email = value.trim();
  if (!email || !email.includes('@')) {
    return '';
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return '';
  }

  const visibleStart = localPart.slice(0, 1);
  const maskedLocal = `${visibleStart}${'*'.repeat(Math.max(localPart.length - 1, 2))}`;

  return `${maskedLocal}@${domain}`;
};
