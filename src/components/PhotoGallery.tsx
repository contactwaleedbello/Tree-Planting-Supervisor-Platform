import React, { useState } from 'react';

export interface PhotoItem {
  id: string;
  signedUrl: string;
  altText?: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  title?: string;
  className?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title = 'Media Files',
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setLoadErrors((prev) => ({ ...prev, [id]: true }));
  };

  const activePhoto = photos[selectedIndex];
  const isCurrentFailed = activePhoto ? loadErrors[activePhoto.id] : false;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-[#1C211B]">{title}</h3>
      )}

      {/* Main Preview */}
      <div className="relative w-full h-56 sm:h-64 bg-[#EEF0F2] rounded-xl overflow-hidden border border-[#E2E5E6] flex items-center justify-center">
        {!activePhoto ? (
          <div className="text-xs text-[#7B7E7B] px-4 text-center">
            No media attached
          </div>
        ) : isCurrentFailed ? (
          /* Rule 2: An expired or broken signed URL shows a clear fallback message in place of the image, not a broken image icon */
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#7B7E7B] gap-2">
            <svg
              className="w-8 h-8 text-[#979A98]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs font-medium text-[#5E625E]">
              Image cannot be loaded right now
            </p>
            <p className="text-[11px] text-[#7B7E7B]">
              The secure link may have expired or is unavailable.
            </p>
          </div>
        ) : (
          <img
            src={activePhoto.signedUrl}
            alt={activePhoto.altText || `Evidence photo ${selectedIndex + 1}`}
            onError={() => handleImageError(activePhoto.id)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail row */}
      {photos.length > 1 && (
        <div className="grid grid-cols-3 gap-2.5">
          {photos.map((photo, index) => {
            const isSelected = index === selectedIndex;
            const hasError = loadErrors[photo.id];
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-20 rounded-lg overflow-hidden border transition-all focus:outline-none ${
                  isSelected
                    ? 'border-[#3C7429] ring-2 ring-[#3C7429]'
                    : 'border-[#E2E5E6] hover:border-[#BBCEB4]'
                }`}
              >
                {hasError ? (
                  <div className="w-full h-full bg-[#EEF0F2] flex items-center justify-center p-1">
                    <span className="text-[10px] text-[#7B7E7B] text-center leading-tight">
                      Unavailable
                    </span>
                  </div>
                ) : (
                  <img
                    src={photo.signedUrl}
                    alt={photo.altText || `Thumbnail ${index + 1}`}
                    onError={() => handleImageError(photo.id)}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
