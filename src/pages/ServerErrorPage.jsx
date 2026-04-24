import ErrorStatePage from "./ErrorStatePage";

export default function ServerErrorPage() {
  return (
    <ErrorStatePage
      code="500"
      title="Đã xảy ra lỗi hệ thống"
      description="Hệ thống đang gặp sự cố trong quá trình xử lý yêu cầu. Vui lòng thử tải lại trang hoặc quay lại sau."
      primaryLabel="Tải lại trang"
      onPrimaryClick={() => window.location.reload()}
      secondaryLabel="Về trang chủ"
      secondaryTo="/"
    />
  );
}
