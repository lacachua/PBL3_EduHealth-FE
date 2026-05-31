import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsRepository } from "../../notifications/inbox/repositories/notificationsRepository";
import SectionHeader from "./SectionHeader";
import PublicNewsCard from "./PublicNewsCard";
import PublicNewsDetailModal from "./PublicNewsDetailModal";

const DEFAULT_NEWS_LIMIT = 3;

const LandingNewsSection = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    notificationsRepository
      .getPublicNotifications({ page: 1, pageSize: DEFAULT_NEWS_LIMIT })
      .then((result) => {
        if (!active) {
          return;
        }
        setItems(Array.isArray(result?.items) ? result.items : []);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setItems([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleViewDetail = (item) => {
    setSelectedNews(item);
    setModalOpen(true);
  };

  const action = (
    <button
      type="button"
      onClick={() => navigate('/news')}
      className="app-focus-ring app-btn-secondary px-5"
    >
      Xem tất cả bản tin
    </button>
  );

  return (
    <section id="ban-tin-y-te" className="scroll-mt-[5.5rem] bg-[#f2f7f3] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Bản tin y tế học đường"
          description="Cập nhật thông tin y tế cần thiết để nhà trường và phụ huynh phối hợp chăm sóc học sinh."
          action={action}
          align="center"
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <PublicNewsCard 
              key={item.id} 
              item={item} 
              onClick={handleViewDetail} 
            />
          ))}
        </div>
        
        {!loading && items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-outline-variant/40 bg-white/40 py-16 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm shadow-primary/5">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant/20">
                newspaper
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant/60">Chưa có bản tin y tế mới.</p>
          </div>
        ) : null}
      </div>

      <PublicNewsDetailModal 
        open={modalOpen}
        item={selectedNews}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};

export default LandingNewsSection;
