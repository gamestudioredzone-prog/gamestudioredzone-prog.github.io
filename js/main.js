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

document
  .querySelectorAll('.reveal')
  .forEach(el => {
    observer.observe(el);
  });


// ==============================
// CURSOR GLOW
// ==============================

if (glow) {
  window.addEventListener(
    'mousemove',
    (e) => {
      glow.style.left =
        e.clientX + 'px';

      glow.style.top =
        e.clientY + 'px';

      glow.style.opacity = '1';
    }
  );
}


// ==============================
// YEAR
// ==============================

const year =
  document.getElementById('year');

if (year) {
  year.textContent =
    new Date().getFullYear();
}


// ==============================
// HERO MOTION
// ==============================

const hero =
  document.querySelector('.hero');

const visual =
  document.querySelector('.hero-visual');

if (hero && visual) {
  hero.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth < 1000) {
        return;
      }

      const x =
        (
          e.clientX /
          window.innerWidth
          -
          0.5
        ) * 14;

      const y =
        (
          e.clientY /
          window.innerHeight
          -
          0.5
        ) * 14;

      visual.style.transform =
        `translate(${x}px, ${y}px)`;
    }
  );

  hero.addEventListener(
    'mouseleave',
    () => {
      visual.style.transform =
        'translate(0,0)';
    }
  );
}


// ==============================
// LIFE BASE / PACHI BASE
// SCREEN CAROUSEL
// ==============================

const carousel =
  document.getElementById(
    'projectCarousel'
  );

if (carousel) {
  const viewport =
    carousel.querySelector(
      '.carousel-viewport'
    );

  const track =
    carousel.querySelector(
      '.carousel-track'
    );

  const slides =
    Array.from(
      carousel.querySelectorAll(
        '.carousel-slide'
      )
    );

  const dots =
    Array.from(
      carousel.querySelectorAll(
        '.carousel-dot'
      )
    );

  const prev =
    carousel.querySelector(
      '.carousel-prev'
    );

  const next =
    carousel.querySelector(
      '.carousel-next'
    );

  if (
    viewport &&
    track &&
    slides.length > 0
  ) {
    let index = 0;
    let startX = null;
    let autoSlideTimer = null;


    // ==============================
    // SLIDE DISPLAY
    // ==============================

    const showSlide = (
      newIndex
    ) => {
      index =
        (
          newIndex +
          slides.length
        ) %
        slides.length;

      track.style.transform =
        `translate3d(-${index * 100}%, 0, 0)`;

      dots.forEach(
        (dot, dotIndex) => {
          dot.classList.toggle(
            'active',
            dotIndex === index
          );

          dot.setAttribute(
            'aria-current',
            dotIndex === index
              ? 'true'
              : 'false'
          );
        }
      );
    };


    // ==============================
    // AUTO SLIDE
    // ==============================

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(
          autoSlideTimer
        );

        autoSlideTimer = null;
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();

      autoSlideTimer =
        setInterval(
          () => {
            showSlide(
              index + 1
            );
          },
          4000
        );
    };


    // ==============================
    // BUTTONS
    // ==============================

    if (prev) {
      prev.addEventListener(
        'click',
        () => {
          showSlide(
            index - 1
          );

          startAutoSlide();
        }
      );
    }

    if (next) {
      next.addEventListener(
        'click',
        () => {
          showSlide(
            index + 1
          );

          startAutoSlide();
        }
      );
    }


    // ==============================
    // DOT BUTTONS
    // ==============================

    dots.forEach(
      (dot, dotIndex) => {
        dot.addEventListener(
          'click',
          () => {
            showSlide(
              dotIndex
            );

            startAutoSlide();
          }
        );
      }
    );


    // ==============================
    // TOUCH / MOUSE SWIPE
    // ==============================

    viewport.addEventListener(
      'pointerdown',
      (e) => {
        startX =
          e.clientX;

        stopAutoSlide();

        if (
          viewport.setPointerCapture
        ) {
          viewport.setPointerCapture(
            e.pointerId
          );
        }
      }
    );

    viewport.addEventListener(
      'pointerup',
      (e) => {
        if (
          startX === null
        ) {
          startAutoSlide();
          return;
        }

        const diff =
          e.clientX -
          startX;

        if (
          Math.abs(diff) >= 45
        ) {
          if (
            diff < 0
          ) {
            showSlide(
              index + 1
            );
          } else {
            showSlide(
              index - 1
            );
          }
        }

        startX = null;

        startAutoSlide();
      }
    );

    viewport.addEventListener(
      'pointercancel',
      () => {
        startX = null;

        startAutoSlide();
      }
    );


    // ==============================
    // PAUSE ON HOVER
    // ==============================

    carousel.addEventListener(
      'mouseenter',
      () => {
        stopAutoSlide();
      }
    );

    carousel.addEventListener(
      'mouseleave',
      () => {
        startAutoSlide();
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
        if (
          e.key ===
          'ArrowLeft'
        ) {
          showSlide(
            index - 1
          );

          startAutoSlide();
        }

        if (
          e.key ===
          'ArrowRight'
        ) {
          showSlide(
            index + 1
          );

          startAutoSlide();
        }
      }
    );


    // ==============================
    // TAB / WINDOW VISIBILITY
    // ==============================

    document.addEventListener(
      'visibilitychange',
      () => {
        if (
          document.hidden
        ) {
          stopAutoSlide();
        } else {
          startAutoSlide();
        }
      }
    );


    // ==============================
    // INITIAL
    // ==============================

    showSlide(0);

    startAutoSlide();
  }
}
