interface GalleryViewProps {
  isPromoted: boolean;
  currentImage: string;
  currentImageIndex: number;
  galleryLength: number;
  mediaItems: Array<{ id: number; url: string }>;
  listingTitle: string;
  onPrevious: () => void;
  onNext: () => void;
  onSelectImage: (index: number) => void;
  t: (key: string) => string;
}

export const GalleryView = ({
  isPromoted,
  currentImage,
  currentImageIndex,
  galleryLength,
  mediaItems,
  listingTitle,
  onPrevious,
  onNext,
  onSelectImage,
  t,
}: GalleryViewProps) => {
  return (
    <div className="gallery card">
      {isPromoted && (
        <div className="promoted-banner">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{t('listing.promoted')}</span>
        </div>
      )}

      <div
        className="gallery-main"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onPrevious();
          if (e.key === 'ArrowRight') onNext();
        }}
      >
        {currentImage ? (
          <img src={currentImage} alt={listingTitle} />
        ) : (
          <div className="no-image-placeholder">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400 mt-2">{t('listing.noImage')}</span>
          </div>
        )}
        {galleryLength > 1 && (
          <>
            <div className="gallery-nav">
              <button onClick={onPrevious} aria-label="Previous">
                ←
              </button>
              
              <button onClick={onNext} aria-label="Next">
                →
              </button>
            </div>
            <div className="gallery-counter">
              {currentImageIndex + 1} / {galleryLength}
            </div>
          </>
        )}
      </div>
      {galleryLength > 0 && (
        <div className="gallery-thumbs">
          {mediaItems.map((item, i) => (
            <img
              key={item.id}
              src={item.url}
              className={i === currentImageIndex ? 'is-active' : ''}
              onClick={() => onSelectImage(i)}
              alt=""
            />
          ))}
        </div>
      )}
    </div>
  );
};
