import React, { useEffect, useState, useCallback } from 'react';
import { notificationsRepository } from '../features/notifications/inbox/repositories/notificationsRepository';
import PublicNewsCard from '../features/landing/components/PublicNewsCard';
import PublicNewsDetailModal from '../features/landing/components/PublicNewsDetailModal';

const PublicNewsListPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchNews = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const result = await notificationsRepository.getPublicNotifications({ 
        page: pageNum, 
        pageSize: 12 
      });
      
      if (pageNum === 1) {
        setItems(result.items || []);
      } else {
        setItems(prev => [...prev, ...(result.items || [])]);
      }
      
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải bản tin:', err);
      setError('Không thể tải danh sách bản tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(1);
    window.scrollTo(0, 0);
  }, [fetchNews]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  const handleViewDetail = (item) => {
    setSelectedNews(item);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pt-[4.25rem]">
      {/* Header Section */}
      <section className="bg-white border-b border-outline-variant/40 py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-2 inline-flex items-center rounded-lg bg-primary-soft/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Bản tin y tế
            </div>
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              Bản tin y tế học đường
            </h1>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-on-surface-variant/90">
              Cập nhật những thông tin mới nhất về tình hình dịch bệnh, lịch tiêm chủng và các kiến thức chăm sóc sức khỏe cho học sinh tại EduHealth.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="rounded-3xl border border-danger/15 bg-danger-soft/20 p-8 text-center backdrop-blur-sm">
               <span className="material-symbols-outlined text-danger mb-3 text-[40px]">error</span>
               <p className="text-danger font-medium">{error}</p>
               <button 
                onClick={() => fetchNews(1)}
                className="app-focus-ring app-btn-secondary mt-4 px-6"
               >
                 Thử lại
               </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <PublicNewsCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleViewDetail} 
                  />
                ))}
              </div>

              {loading && page === 1 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                   {[...Array(8)].map((_, i) => (
                     <div key={i} className="animate-pulse rounded-2xl bg-surface-container-low h-80"></div>
                   ))}
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                   <div className="h-16 w-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-4 rotate-3 shadow-inner">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant/20">newspaper</span>
                   </div>
                   <h3 className="text-lg font-bold text-on-surface">Chưa có bản tin nào</h3>
                   <p className="text-on-surface-variant/80 mt-1 max-w-xs mx-auto">Các bản tin y tế mới nhất sẽ sớm được cập nhật tại đây.</p>
                </div>
              )}

              {page < totalPages && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="app-focus-ring app-btn-secondary min-w-[160px] px-8 py-3"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      'Xem thêm bản tin'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PublicNewsDetailModal 
        open={modalOpen}
        item={selectedNews}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default PublicNewsListPage;
