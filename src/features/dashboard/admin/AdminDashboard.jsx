import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon="group" label="Tổng học sinh" value="1,240" color="bg-primary/10 text-primary" />
      <StatCard icon="medical_services" label="Lượt khám hôm nay" value="45" color="bg-secondary/10 text-secondary" />
      <StatCard icon="inventory_2" label="Thuốc sắp hết hạn" value="12" color="bg-error/10 text-error" />
      <StatCard icon="vaccines" label="Lịch tiêm chủng" value="8" color="bg-tertiary/10 text-tertiary" />
      
      <div className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <div>
                  <p className="font-bold">Cập nhật hồ sơ học sinh #{i*123}</p>
                  <p className="text-xs text-on-surface-variant">Bởi Y tá Nguyễn Văn A • 10 phút trước</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold mb-4">Thông báo hệ thống</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-error/5 border border-error/10">
            <p className="text-sm font-bold text-error">Cảnh báo tồn kho</p>
            <p className="text-xs text-on-surface-variant mt-1">Paracetamol 500mg còn dưới 50 vỉ.</p>
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-bold text-primary">Bảo trì hệ thống</p>
            <p className="text-xs text-on-surface-variant mt-1">Dự kiến vào 23:00 tối nay.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <p className="text-sm text-on-surface-variant font-medium">{label}</p>
    <p className="text-2xl font-black mt-1">{value}</p>
  </div>
);

export default AdminDashboard;
