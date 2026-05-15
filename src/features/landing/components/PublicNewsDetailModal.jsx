import React from 'react';
import { getNotificationTypeMeta } from '../../notifications/inbox/constants/notificationTypes';

const formatFullDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PublicNewsDetailModal = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  const typeMeta = getNotificationTypeMeta(item.type, 'PUBLIC');
  const dateLabel = formatFullDate(item.createdAt);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant/60 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Row */}
        <header className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Bản tin y tế</p>
          <button 
            type="button" 
            onClick={onClose} 
            className="app-focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto max-w-2xl space-y-6">
            {/* Title */}
            <h1 className="font-headline text-2xl font-black leading-tight text-on-surface sm:text-3xl">
              {item.title}
            </h1>
            
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-lg bg-primary-soft/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {typeMeta.label}
              </span>
              {dateLabel ? (
                <span className="text-[13px] font-medium text-on-surface-variant/80">
                  {dateLabel}
                </span>
              ) : null}
            </div>

            {/* Image Block */}
            {item.imageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="max-h-[480px] w-full object-contain"
                  onError={(e) => e.currentTarget.parentElement.classList.add('hidden')}
                />
              </div>
            ) : null}

            {/* Content Body */}
            <div className="text-[15px] leading-relaxed text-on-surface-variant/95 sm:text-[16px]">
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>

            {/* Bottom Action */}
            <div className="pt-8 text-center pb-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="app-focus-ring app-btn-secondary min-w-[100px] px-6 py-2 text-[14px] font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PublicNewsDetailModal;
