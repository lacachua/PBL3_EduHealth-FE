import React from 'react';

const NurseDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bảng điều khiển Y tá</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">Tiếp nhận bệnh nhân</h3>
          <button className="w-full py-3 bg-primary text-white rounded-xl font-bold">Khám mới</button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">Danh sách chờ</h3>
          <p className="text-sm text-slate-500 italic">Không có học sinh nào đang chờ.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">Lịch tiêm chủng tuần này</h3>
          <p className="text-sm font-bold text-primary">15 học sinh lớp 1</p>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
