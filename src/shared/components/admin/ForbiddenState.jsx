
const ForbiddenState = ({ message = 'Bạn không có quyền truy cập dữ liệu này.' }) => (
  <div className="rounded-lg border border-warning/25 bg-warning-soft px-4 py-5">
    <p className="text-sm font-semibold text-warning">Không có quyền truy cập</p>
    <p className="mt-1 text-xs text-warning/90">{message}</p>
  </div>
);

export default ForbiddenState;
