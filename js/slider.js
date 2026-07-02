// CAROUSEL NAVIGATION //

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slideTrack');
  const slides = track.children;
  const slideWidth = 250;
  // const slideWidth = slides[0].getBoundingClientRect().width;
  const visibleSlides = 5;
  const totalSlides = slides.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  let currentIndex = 0;

  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  function updateSlider() {
    const offset = currentIndex * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  });

  updateSlider();
});