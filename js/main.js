const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');
const glow = document.getElementById('cursorGlow');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

if (glow) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const hero = document.querySelector('.hero');
const visual = document.querySelector('.hero-visual');

if (hero && visual) {
  hero.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1000) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;

    visual.style.transform = `translate(${x}px, ${y}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    visual.style.transform = 'translate(0,0)';
  });
}


/* =========================================
   PROJECT SCREEN CAROUSEL
   1画面ずつ左右スワイプ
========================================= */

const carousel = document.querySelector('.project-carousel');

if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));

  let currentIndex = 0;
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  function updateCarousel() {
    if (!track || slides.length === 0) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.setAttribute(
        'aria-current',
        index === currentIndex ? 'true' : 'false'
      );
    });

    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled = currentIndex === slides.length - 1;
    }
  }

  function goToSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    }

    if (index >= slides.length) {
      index = 0;
    }

    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }


  /* ---------- 矢印 ---------- */

  if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
  }

  if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
  }


  /* ---------- ●ボタン ---------- */

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });


  /* ---------- スマホ：指スワイプ ---------- */

  track.addEventListener(
    'touchstart',
    (e) => {
      if (!e.touches.length) return;

      startX = e.touches[0].clientX;
      currentX = startX;
      dragging = true;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchmove',
    (e) => {
      if (!dragging || !e.touches.length) return;

      currentX = e.touches[0].clientX;
    },
    { passive: true }
  );

  track.addEventListener('touchend', () => {
    if (!dragging) return;

    const distance = currentX - startX;
    const threshold = 45;

    if (distance < -threshold) {
      nextSlide();
    } else if (distance > threshold) {
      prevSlide();
    }

    dragging = false;
    startX = 0;
    currentX = 0;
  });


  /* ---------- PC：マウスドラッグ ---------- */

  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    currentX = startX;
    dragging = true;

    track.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;

    currentX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;

    const distance = currentX - startX;
    const threshold = 60;

    if (distance < -threshold) {
      nextSlide();
    } else if (distance > threshold) {
      prevSlide();
    }

    dragging = false;
    track.classList.remove('dragging');

    startX = 0;
    currentX = 0;
  });


  /* ---------- キーボード ---------- */

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }

    if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });


  /* ---------- 初期表示 ---------- */

  updateCarousel();
}
