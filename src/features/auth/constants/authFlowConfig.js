import loginVisual from '../../../assets/images/auth/login.png';
import forgotVisual from '../../../assets/images/auth/login.png';
import otpVisual from '../../../assets/images/auth/login.png';
import changePasswordVisual from '../../../assets/images/auth/login.png';

const AUTH_FLOW_CONFIG_SINGLETON = Object.freeze({
  panel: {
    login: {
      tag: 'TRUY CẬP HỆ THỐNG',
      headline: 'Quản lý sức khỏe học đường',
      caption: 'Dành cho tài khoản được nhà trường cấp.',
      imageAlt: 'Bàn làm việc y tế học đường với hồ sơ và máy tính bảng đang mở',
      imageSrc: loginVisual,
    },
    forgotPassword: {
      tag: 'KHÔI PHỤC TÀI KHOẢN',
      headline: 'Xác minh để tiếp tục',
      caption: '',
      imageAlt: 'Sổ biểu mẫu y tế học đường đặt cạnh thiết bị nhập liệu',
      imageSrc: forgotVisual,
    },
    verifyOtp: {
      tag: 'XÁC THỰC OTP',
      headline: 'Nhập mã đã gửi đến email của bạn',
      caption: '',
      imageAlt: 'Thiết bị hiển thị mã xác thực trong quy trình đăng nhập an toàn',
      imageSrc: otpVisual,
    },
    changePassword: {
      tag: 'TẠO MẬT KHẨU MỚI',
      headline: 'Cập nhật quyền truy cập an toàn',
      caption: '',
      imageAlt: 'Người dùng thao tác cập nhật thông tin tài khoản trên màn hình làm việc',
      imageSrc: changePasswordVisual,
    },
  },
});

export const AUTH_PANEL_CONFIG = AUTH_FLOW_CONFIG_SINGLETON.panel;
