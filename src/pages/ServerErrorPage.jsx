import { Link } from "react-router-dom";

export default function ServerErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.code}>500</span>
        <h1 style={styles.title}>Đã xảy ra lỗi hệ thống</h1>
        <p style={styles.description}>
          Hệ thống đang gặp sự cố trong quá trình xử lý yêu cầu.
          Bạn hãy thử tải lại trang hoặc quay lại sau ít phút.
        </p>

        <div style={styles.actions}>
          <button style={styles.primaryButton} onClick={handleReload}>
            Tải lại trang
          </button>
          <Link to="/" style={{ ...styles.button, ...styles.secondaryLink }}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "linear-gradient(135deg, #fff5f5 0%, #fef2f2 50%, #fff7f7 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "20px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    border: "1px solid #fecaca",
  },
  code: {
    display: "inline-block",
    fontSize: "64px",
    fontWeight: 800,
    color: "#dc2626",
    marginBottom: "12px",
    lineHeight: 1,
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "12px",
  },
  description: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: 1.6,
    marginBottom: "28px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  button: {
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "15px",
    transition: "0.2s ease",
  },
  primaryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
  },
  secondaryLink: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
  },
};