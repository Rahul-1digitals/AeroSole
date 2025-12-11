import React, { useEffect, useState } from 'react';
import './ShowcaseSlider.scss';

const SLIDES = [
  {
    id: 0,
    type: 'video',
  },
  {
    id: 1,
    type: 'image',
  },
];

const AUTOPLAY_INTERVAL = 6000; // ms

const ShowcaseSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0-1 progress for the active slide

  const goToSlide = (index) => {
    const total = SLIDES.length;
    const nextIndex = ((index % total) + total) % total;
    setCurrentSlide(nextIndex);
    setProgress(0);
  };

  const handleNext = () => {
    goToSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    goToSlide(currentSlide - 1);
  };

  const toggleAutoplay = () => {
    setIsAutoplaying((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoplaying) return;

    const duration = AUTOPLAY_INTERVAL;
    // Start time offset so that we can resume from the existing progress value
    let startTime = performance.now() - progress * duration;
    let frameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);

      setProgress(ratio);

      if (ratio >= 1) {
        // When the current slide's time is up, advance and restart timing
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        startTime = now;
        setProgress(0);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isAutoplaying, progress]);

  return (
    <section className="showcase-slider-section">
      <div className="showcase-slider">
        <div className="showcase-slider-track">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`showcase-slide ${index === currentSlide ? 'is-active' : ''}`}
            >
              {slide.type === 'video' ? (
                <div className="showcase-media-wrapper">
                  <video
                    className="showcase-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source
                      src="https://assets.vans.com/video/upload/c_limit,w_1920/ac_none/q_auto:best,f_auto:video,d_na.png/v1764979280/FA25_12092025_LP_Homepage_Hero-01_Desktop_1440x906_Video"
                      media="(min-width:1024px)"
                    />
                    <source
                      src="https://assets.vans.com/video/upload/c_limit,w_1080/ac_none/q_auto:best,f_auto:video,d_na.png/v1764979280/FA25_12092025_LP_Homepage_Hero-01_Desktop_1440x906_Video"
                      media="(min-width:768px)"
                    />
                    <source
                      src="https://assets.vans.com/video/upload/c_limit,w_1080/ac_none/q_auto:best,f_auto:video,d_na.png/v1764979280/FA25_12092025_LP_Homepage_Hero-01_Desktop_1440x906_Video"
                    />
                  </video>
                </div>
              ) : (
                <div className="showcase-media-wrapper">
                  <picture>
                    <source
                      srcSet="https://assets.vans.com/image/upload/c_limit,w_1920/q_auto:best,f_auto:image,d_na.png/v1764956280/FA25_12082025_LP_Homepage_Hero-01_Desktop_1440x906_Image"
                      media="(min-width:1024px)"
                    />
                    <source
                      srcSet="https://assets.vans.com/image/upload/c_limit,w_1080/q_auto:best,f_auto:image,d_na.png/v1764956280/FA25_12082025_LP_Homepage_Hero-01_Desktop_1440x906_Image"
                      media="(min-width:768px)"
                    />
                    <img
                      className="showcase-image"
                      src="https://assets.vans.com/image/upload/c_limit,w_1080/q_auto:best,f_auto:image,d_na.png/v1764956280/FA25_12082025_LP_Homepage_Hero-01_Desktop_1440x906_Image"
                      alt="Branded hero artwork"
                    />
                  </picture>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="showcase-arrow showcase-arrow-left"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <span className="showcase-arrow-icon" />
        </button>

        <button
          type="button"
          className="showcase-arrow showcase-arrow-right"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <span className="showcase-arrow-icon" />
        </button>

        <div className="showcase-controls">
        {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;

            // SVG circle geometry
            const radius = 45;
            const circumference = 2 * Math.PI * radius;
            // Only the active slide uses the animated progress value
            const value = isActive ? progress : 0;
            const dashOffset = circumference * (1 - value);

            const handleClick = () => {
            // If you click the active dot, toggle play/pause.
            // If you click an inactive dot, jump to that slide and keep autoplay.
            if (isActive) {
                toggleAutoplay();
            } else {
                goToSlide(index);
            }
            };

            return (
            <button
                key={slide.id}
                type="button"
                className="showcase-dot"
                onClick={handleClick}
                aria-label={
                isActive
                    ? isAutoplaying
                    ? 'Pause autoplay'
                    : 'Play autoplay'
                    : `Go to slide ${index + 1}`
                }
            >
                <svg
                aria-hidden="true"
                className="showcase-dot-svg"
                viewBox="0 0 100 100"
                >
                {/* Background circle */}
                <circle
                    className="showcase-dot-bg"
                    cx="50"
                    cy="50"
                    r={radius}
                />
                {/* Progress circle – only visible when active */}
                <circle
                    className={`showcase-dot-progress ${
                    isActive ? 'is-active' : ''
                    }`}
                    cx="50"
                    cy="50"
                    r={radius}
                    style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: dashOffset,
                    }}
                />
                </svg>

                <span className="showcase-dot-center">
                {isActive ? (
                    // Active slide shows pause or play icon
                    <span className="showcase-dot-icon">
                    {isAutoplaying ? (
                        // Pause (two bars)
                        <>
                        <span className="pause-bar" />
                        <span className="pause-bar" />
                        </>
                    ) : (
                        // Play (triangle)
                        <span className="play-triangle" />
                    )}
                    </span>
                ) : (
                    // Inactive slides show their number
                    <span className="showcase-dot-label">{index + 1}</span>
                )}
                </span>
            </button>
            );
        })}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSlider;
