import React from 'react';

const ParentDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Cổng thông tin Phụ huynh</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold mb-4">Sức khỏe của con</h3>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div>
            <p className="font-bold">Nguyễn Văn B</p>
            <p className="text-sm text-slate-500">Lớp 5A • Tình trạng: Bình thường</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
