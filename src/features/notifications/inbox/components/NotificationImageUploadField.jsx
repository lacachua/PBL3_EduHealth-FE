import React, { useRef } from 'react';

const NotificationImageUploadField = ({
  onImageSelect,
  onImageClear,
  imageFileName,
  imagePreviewUrl,
  imageUploading,
  imageUploadError,
}) => {
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    if (!imageUploading && !imagePreviewUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear input value so same file can be selected again if needed
      event.target.value = '';
      onImageSelect(file);
    }
  };

  const handleChangeImageClick = () => {
    if (!imageUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-1">
      <span className="app-overline">Ảnh minh họa</span>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={imageUploading}
      />

      {!imagePreviewUrl && !imageFileName && (
        <div
          onClick={handleContainerClick}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low px-4 py-8 transition-colors hover:border-primary/50 hover:bg-surface-container ${
            imageUploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-on-surface">Chọn ảnh minh họa</p>
            <p className="mt-1 text-xs text-on-surface-variant">Hỗ trợ JPG, PNG, WEBP · tối đa 5MB</p>
          </div>
        </div>
      )}

      {(imagePreviewUrl || imageFileName) && (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface">
          {imagePreviewUrl && (
            <div className="relative aspect-video w-full bg-surface-container-low">
              <img
                src={imagePreviewUrl}
                alt="Ảnh minh họa"
                className={`h-full w-full object-cover transition-opacity ${imageUploading ? 'opacity-50' : 'opacity-100'}`}
                loading="lazy"
              />
              {imageUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
                    <p className="text-sm font-semibold text-primary">Đang tải ảnh lên...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 border-t border-outline-variant">
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-sm font-semibold text-on-surface" title={imageFileName}>
                {imageFileName || 'Đang xử lý ảnh...'}
              </p>
              {imageUploadError ? (
                <p className="mt-0.5 text-xs font-medium text-danger">{imageUploadError}</p>
              ) : null}
            </div>
            
            <div className="flex shrink-0 items-center gap-2">
              {imageUploadError ? (
                <button
                  type="button"
                  onClick={handleChangeImageClick}
                  className="app-focus-ring app-btn-secondary px-3 py-1.5 text-sm"
                  disabled={imageUploading}
                >
                  Thử lại
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleChangeImageClick}
                  className="app-focus-ring app-btn-secondary px-3 py-1.5 text-sm"
                  disabled={imageUploading}
                >
                  Đổi ảnh
                </button>
              )}
              <button
                type="button"
                onClick={onImageClear}
                className="app-focus-ring app-btn-secondary px-3 py-1.5 text-sm text-danger hover:bg-danger/10 hover:text-danger"
                disabled={imageUploading}
              >
                Gỡ ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationImageUploadField;
