import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import './CarouselSection.scss';

const carouselVideos = [
  { src: '/videos/carousel1.mp4', label: 'SKATEBOARDING' },
  { src: '/videos/carousel2.mp4', label: 'BMX' },
  { src: '/videos/carousel3.mp4', label: 'SURFING' },
  { src: '/videos/carousel4.mp4', label: 'RUNNING' },
  { src: '/videos/carousel5.mp4', label: 'CASUAL' },
];

const CarouselSection = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: false, // Turn off variable width to let Slick handle sizing
    centerMode: false,
    responsive: [
      { breakpoint: 1100, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 800, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    swipeToSlide: true,
    accessibility: true,
    initialSlide: 0,
    adaptiveHeight: false,
    useTransform: true,
    cssEase: 'ease-in-out',
  };

  // Custom scroll handler for mouse wheel
  const sliderRef = React.useRef();
  React.useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !slider.innerSlider || !slider.innerSlider.list) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        if (e.deltaY > 0) {
          slider.slickNext();
        } else {
          slider.slickPrev();
        }
      }
    };
    slider.innerSlider.list.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      if (slider && slider.innerSlider && slider.innerSlider.list) {
        slider.innerSlider.list.removeEventListener('wheel', onWheel);
      }
    };
  }, []);


  return (
    <section className="carousel-section">
      <h2 className="carousel-title">Need Some Inspiration?</h2>
      <Slider ref={sliderRef} {...settings} className="carousel-slider">
        {carouselVideos.map((item, idx) => (
          <div className="carousel-card" key={idx}>
            <div className="carousel-video-wrapper">
              <video
                className="carousel-video"
                src={item.src}
                loop
                muted
                playsInline
                preload="auto"
                poster=""
                onMouseOver={e => { e.target.play(); e.target.parentNode.classList.add('hovered'); }}
                onFocus={e => { e.target.play(); e.target.parentNode.classList.add('hovered'); }}
                onMouseOut={e => { e.target.pause(); e.target.parentNode.classList.remove('hovered'); }}
                onBlur={e => { e.target.pause(); e.target.parentNode.classList.remove('hovered'); }}
                tabIndex={0}
                aria-label={item.label + ' inspiration video'}
              />
              <div className="carousel-label">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CarouselSection;
