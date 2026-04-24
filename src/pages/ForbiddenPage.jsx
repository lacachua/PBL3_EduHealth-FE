import ErrorStatePage from "./ErrorStatePage";

export default function ForbiddenPage() {
  return (
    <ErrorStatePage
      code="403"
      title="Bạn không có quyền truy cập"
      description="Tài khoản hiện tại không được phép truy cập khu vực này."
      primaryLabel="Về trang chủ"
      primaryTo="/"
      secondaryLabel="Quay lại"
      onSecondaryClick={() => window.history.back()}
    />
  );
}
