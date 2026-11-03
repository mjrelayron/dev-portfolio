import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Play } from 'lucide-react';
import '../showroom/showroom.css';

const isVideoSrc = (src) => /\.(mp4|webm|mov)(\?|$)/i.test(src ?? '');

const LightboxGallery = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const mediaBoxRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          // keep the global Esc shortcut (back to the map) from also firing
          e.stopPropagation();
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
        default:
          break;
      }
    };

    // Prevent background scrolling when lightbox is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  // move focus into the dialog, give it back on close
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, [isOpen]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 1));
    if (scale <= 1.2) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // React wheel listeners are passive, so preventDefault needs a native listener
  const wheelRef = useRef(handleWheel);
  wheelRef.current = handleWheel;
  useEffect(() => {
    const el = mediaBoxRef.current;
    if (!isOpen || !el) return;
    const onWheel = (e) => wheelRef.current(e);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen, images?.length]);

  if (!isOpen || !images.length || typeof document === 'undefined') return null;

  const current = images[currentIndex];
  const mediaStyle = {
    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
    transformOrigin: 'center',
    cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in',
  };

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`Image viewer, ${currentIndex + 1} of ${images.length}`} data-accent="violet">
      {/* Background overlay */}
      <div className="lb__scrim" onClick={onClose} aria-hidden />

      {/* Top bar */}
      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-3">
        <p className="lb__pill hidden sm:flex">Wheel or +/- to zoom · drag to pan · arrows to browse · Esc to close</p>
        <button ref={closeRef} type="button" onClick={onClose} className="lb__btn ml-auto" aria-label="Close viewer">
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Main container */}
      <div className="lb__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button type="button" onClick={goToPrevious} className="lb__btn absolute left-3 top-1/2 z-20 -translate-y-1/2 sm:left-5" aria-label="Previous image">
              <ChevronLeft size={22} aria-hidden />
            </button>
            <button type="button" onClick={goToNext} className="lb__btn absolute right-3 top-1/2 z-20 -translate-y-1/2 sm:right-5" aria-label="Next image">
              <ChevronRight size={22} aria-hidden />
            </button>
          </>
        )}

        {/* Media container */}
        <div
          ref={mediaBoxRef}
          className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {isVideoSrc(current) ? (
            <video
              ref={imageRef}
              src={current}
              className="lb__media"
              style={mediaStyle}
              controls
              autoPlay
              muted
              loop
              playsInline
              draggable={false}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              ref={imageRef}
              src={current}
              alt={`Gallery image ${currentIndex + 1} of ${images.length}`}
              className="lb__media"
              style={mediaStyle}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 z-20 flex w-[calc(100%-32px)] max-w-xl -translate-x-1/2 flex-col items-center gap-3">
        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="lb__pill scrollbar-none max-w-full overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                  resetZoom();
                }}
                className="lb__thumb relative"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              >
                {isVideoSrc(image) ? (
                  <>
                    <video src={image} className="h-full w-full object-cover" muted preload="metadata" />
                    <span className="absolute inset-0 grid place-items-center bg-[rgba(9,11,28,0.4)] text-white">
                      <Play size={14} aria-hidden fill="currentColor" />
                    </span>
                  </>
                ) : (
                  <img src={image} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="lb__pill">
            <button type="button" onClick={handleZoomOut} className="lb__btn lb__btn--sm" aria-label="Zoom out">
              <ZoomOut size={16} aria-hidden />
            </button>
            <span className="min-w-[3.2rem] text-center" aria-live="polite">{Math.round(scale * 100)}%</span>
            <button type="button" onClick={handleZoomIn} className="lb__btn lb__btn--sm" aria-label="Zoom in">
              <ZoomIn size={16} aria-hidden />
            </button>
            <button type="button" onClick={resetZoom} className="lb__btn lb__btn--sm" aria-label="Reset zoom">
              <RotateCcw size={15} aria-hidden />
            </button>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <span className="lb__pill">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LightboxGallery;
