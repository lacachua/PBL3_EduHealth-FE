const ErrorState = ({ message = 'Không thể tải dữ liệu.', onRetry }) => (
  <div className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-4">
    <p className="text-[15px] font-semibold text-danger">Lỗi tải dữ liệu</p>
    <p className="mt-1 text-[12px] text-danger/95">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="app-focus-ring app-btn-danger mt-3"
      >
        Thử lại
      </button>
    ) : null}
  </div>
);

export default ErrorState;
