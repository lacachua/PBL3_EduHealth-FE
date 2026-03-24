import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
      <h1 className="text-9xl font-black text-primary/20">404</h1>
      <h2 className="text-3xl font-bold mt-4">Trang không tồn tại</h2>
      <p className="text-on-surface-variant mt-2 max-w-md">
        Rất tiếc, chúng tôi không tìm thấy trang bạn đang yêu cầu. Vui lòng kiểm tra lại đường dẫn.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary" className="px-8 py-3">
          Quay lại trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
