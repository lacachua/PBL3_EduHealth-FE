const InlineError = ({ message }) => {
  if (!message) return null;

  return <p className="mt-1 text-xs font-medium text-danger">{message}</p>;
};

export default InlineError;
