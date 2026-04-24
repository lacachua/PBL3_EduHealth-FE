import ErrorStatePage from "./ErrorStatePage";

export default function NotFoundPage() {
  return (
    <ErrorStatePage
      code="404"
      title="Trang không tồn tại"
      description="Không tìm thấy trang bạn đang yêu cầu."
      primaryLabel="Về trang chủ"
      primaryTo="/"
    />
  );
}
