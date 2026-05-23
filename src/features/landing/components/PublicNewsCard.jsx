import React, { useState } from 'react';
import { getNotificationTypeMeta } from '../../notifications/inbox/constants/notificationTypes';

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

const PublicNewsCard = ({ item, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const typeMeta = getNotificationTypeMeta(item.type, 'PUBLIC');
  const dateLabel = formatNewsDate(item.createdAt);

  return (
    <article 
      onClick={() => onClick(item)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.25rem] border border-outline-variant/60 bg-white shadow-[0_8px_20px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)]"
    >
      {item.imageUrl && !imageError ? (
        <div className="h-48 w-full overflow-hidden bg-surface-container-lowest">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      ) : null}
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-lg border border-primary/15 bg-primary-soft/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {typeMeta.label}
          </span>
          {dateLabel ? (
            <span className="text-[11px] font-medium text-on-surface-variant/80">
              {dateLabel}
            </span>
          ) : null}
        </div>
        
        <h3 className="app-clamp-2 mb-3 font-headline text-[1.125rem] font-bold leading-tight text-on-surface transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        
        <p className="app-clamp-3 mb-4 flex-1 text-[13.5px] leading-relaxed text-on-surface-variant/90">
          {item.summary || item.content}
        </p>
        
        <div className="mt-auto flex items-center gap-1.5 text-[13px] font-bold text-primary">
          <span>Xem chi tiết</span>
          <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">
            arrow_right_alt
          </span>
        </div>
      </div>
    </article>
  );
};

export default PublicNewsCard;
