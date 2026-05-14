import React, { useEffect, useMemo, useState } from "react";
import { notificationsRepository } from "../../notifications/inbox/repositories/notificationsRepository";
import SectionHeader from "./SectionHeader";

const DEFAULT_NEWS_LIMIT = 3;

const formatNewsDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `Cập nhật: ${date.toLocaleDateString("vi-VN")}`;
};

const LandingNewsSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const newsItems = useMemo(
    () => items.map((item) => ({
      ...item,
      dateLabel: formatNewsDate(item.createdAt),
    })),
    [items],
  );

  const action = (
    <button
      type="button"
      className="app-focus-ring app-btn-secondary px-5"
    >
      Xem tất cả bản tin
    </button>
  );

  return (
    <section id="ban-tin-y-te" className="bg-[#f2f7f3] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Bản tin y tế học đường"
          description="Cập nhật thông tin y tế cần thiết để nhà trường và phụ huynh phối hợp chăm sóc học sinh."
          action={action}
          align="center"
        />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-4.5">
          {newsItems.map((item) => (
            <article key={item.title} className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/75 bg-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.38)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_30px_-18px_rgba(15,23,42,0.5)]">
              {item.imageUrl ? (
                <div className="h-40 w-full overflow-hidden bg-surface">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.classList.add('hidden');
                      if (event.currentTarget.parentElement) {
                        event.currentTarget.parentElement.classList.add('hidden');
                      }
                    }}
                  />
                </div>
              ) : null}
              <div className="flex h-full flex-col p-5">
                {item.dateLabel ? (
                  <p className="mb-3 inline-flex w-fit items-center rounded-full border border-primary/18 bg-primary-soft/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-primary">{item.dateLabel}</p>
                ) : null}
                <h3 className="mb-3 font-headline text-[1.24rem] font-bold leading-snug text-on-surface">{item.title}</h3>
                <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
        {!loading && newsItems.length === 0 ? (
          <p className="mt-4 text-center text-sm text-on-surface-variant">Chưa có bản tin y tế.</p>
        ) : null}
      </div>
    </section>
  );
};

export default LandingNewsSection;
