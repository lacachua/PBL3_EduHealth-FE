import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.code}>403</span>
        <h1 style={styles.title}>Bạn không có quyền truy cập</h1>
        <p style={styles.description}>
          Tài khoản hiện tại không được phép truy cập vào khu vực này.
          Vui lòng kiểm tra lại vai trò hoặc đăng nhập bằng tài khoản phù hợp.
        </p>

        <div style={styles.actions}>
          <Link to="/" style={{ ...styles.button, ...styles.primaryButton }}>
            Về trang chủ
          </Link>
          <button style={styles.secondaryButton} onClick={() => window.history.back()}>
            Quay lại
          </button>
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
      "linear-gradient(135deg, #fffaf5 0%, #fff4e8 50%, #fff7ed 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "20px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    border: "1px solid #fde7c7",
  },
  code: {
    display: "inline-block",
    fontSize: "64px",
    fontWeight: 800,
    color: "#ea580c",
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
    background: "#ea580c",
    color: "#fff",
  },
  secondaryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
  },
};