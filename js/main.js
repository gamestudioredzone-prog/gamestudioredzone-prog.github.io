const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');
const glow = document.getElementById('cursorGlow');


// ==============================
// MOBILE MENU
// ==============================

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    toggle.setAttribute(
      'aria-expanded',
      String(open)
    );
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );
    });
  });
}


// ==============================
// REVEAL
// ==============================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});


// ==============================
// CURSOR GLOW
// ==============================

if (glow) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
}


// ==============================
// YEAR
// ==============================

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}


// ==============================
// HERO MOTION
// ==============================

const hero = document.querySelector('.hero');
const visual = document.querySelector('.hero-visual');

if (hero && visual) {
  hero.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1000) return;

    const x =
      (e.clientX / window.innerWidth - 0.5) * 14;

    const y =
      (e.clientY / window.innerHeight - 0.5) * 14;

    visual.style.transform =
      `translate(${x}px, ${y}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    visual.style.transform = 'translate(0,0)';
  });
}


// ==============================
// PROJECT CAROUSEL
// ==============================

const carousel =
  document.getElementById('projectCarousel');

if (carousel) {

  const viewport =
    carousel.querySelector('.carousel-viewport');

  const track =
    carousel.querySelector('.carousel-track');

  const slides =
    Array.from(
      carousel.querySelectorAll('.carousel-slide')
    );

  const dots =
    Array.from(
      carousel.querySelectorAll('.carousel-dot')
    );

  const prev =
    carousel.querySelector('.carousel-prev');

  const next =
    carousel.querySelector('.carousel-next');


  if (viewport && track && slides.length > 0) {

    let currentIndex = 0;
    let startX = null;
    let autoTimer = null;


    // ==============================
    // SHOW SLIDE
    // ==============================

    function showSlide(index) {

      currentIndex =
        (index + slides.length) %
        slides.length;

      track.style.transform =
        `translate3d(-${currentIndex * 100}%, 0, 0)`;

      dots.forEach((dot, dotIndex) => {

        const active =
          dotIndex === currentIndex;

        dot.classList.toggle(
          'active',
          active
        );

        dot.setAttribute(
          'aria-current',
          active ? 'true' : 'false'
        );
      });
    }


    // ==============================
    // NEXT / PREV
    // ==============================

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }


    // ==============================
    // AUTO PLAY
    // ==============================

    function stopAutoPlay() {

      if (autoTimer !== null) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoPlay() {

      stopAutoPlay();

      autoTimer = setInterval(() => {
        nextSlide();
      }, 3000);
    }


    // ==============================
    // ARROW BUTTONS
    // ==============================

    if (prev) {
      prev.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }


    // ==============================
    // DOT BUTTONS
    // ==============================

    dots.forEach((dot, dotIndex) => {

      dot.addEventListener('click', () => {

        showSlide(dotIndex);

        startAutoPlay();
      });
    });


    // ==============================
    // POINTER / SWIPE
    // ==============================

    viewport.addEventListener(
      'pointerdown',
      (e) => {

        startX = e.clientX;

        if (viewport.setPointerCapture) {
          viewport.setPointerCapture(
            e.pointerId
          );
        }
      }
    );

    viewport.addEventListener(
      'pointerup',
      (e) => {

        if (startX === null) return;

        const diff =
          e.clientX - startX;

        if (Math.abs(diff) >= 45) {

          if (diff < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }

        startX = null;

        startAutoPlay();
      }
    );

    viewport.addEventListener(
      'pointercancel',
      () => {

        startX = null;

        startAutoPlay();
      }
    );


    // ==============================
    // KEYBOARD
    // ==============================

    carousel.setAttribute(
      'tabindex',
      '0'
    );

    carousel.addEventListener(
      'keydown',
      (e) => {

        if (e.key === 'ArrowLeft') {
          prevSlide();
          startAutoPlay();
        }

        if (e.key === 'ArrowRight') {
          nextSlide();
          startAutoPlay();
        }
      }
    );


    // ==============================
    // PAGE VISIBILITY
    // ==============================

    document.addEventListener(
      'visibilitychange',
      () => {

        if (document.hidden) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
      }
    );


    // ==============================
    // START
    // ==============================

    showSlide(0);
    startAutoPlay();
  }
}
