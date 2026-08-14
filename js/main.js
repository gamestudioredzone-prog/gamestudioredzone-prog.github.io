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


// ==============================
// REVEAL
// ==============================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});


// ==============================
// CURSOR GLOW
// ==============================

if (glow) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
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
    visual.style.transform =
      'translate(0,0)';
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

  if (
    viewport &&
    track &&
    slides.length > 0
  ) {
    let index = 0;
    let startX = null;
    let timer = null;

    const show = (newIndex) => {
      index =
        (newIndex + slides.length) %
        slides.length;

      track.style.transform =
        `translate3d(-${index * 100}%, 0, 0)`;

      dots.forEach((dot, i) => {
        const active = i === index;

        dot.classList.toggle(
          'active',
          active
        );

        dot.setAttribute(
          'aria-current',
          active ? 'true' : 'false'
        );
      });
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
      }

      timer = null;
    };

    const start = () => {
      stop();

      timer = setInterval(() => {
        show(index + 1);
      }, 3000);
    };

    if (prev) {
      prev.addEventListener('click', () => {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        show(index + 1);
        start();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i);
        start();
      });
    });

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
        if (startX === null) {
          return;
        }

        const diff =
          e.clientX - startX;

        if (Math.abs(diff) >= 45) {
          show(
            index +
            (diff < 0 ? 1 : -1)
          );
        }

        startX = null;

        start();
      }
    );

    viewport.addEventListener(
      'pointercancel',
      () => {
        startX = null;
        start();
      }
    );

    carousel.setAttribute(
      'tabindex',
      '0'
    );

    carousel.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'ArrowLeft') {
          show(index - 1);
          start();
        }

        if (e.key === 'ArrowRight') {
          show(index + 1);
          start();
        }
      }
    );

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      }
    );

    show(0);
    start();
  }
}


// ==============================
// CREATOR / MAR MOTION
// ==============================

const creatorMotion =
  document.getElementById(
    'creatorMotion'
  );

if (creatorMotion) {
  const stage =
    creatorMotion.querySelector(
      '.creator-stage'
    );

  const character =
    creatorMotion.querySelector(
      '.creator-character-wrap'
    );

  creatorMotion.addEventListener(
    'mousemove',
    (e) => {
      if (
        window.innerWidth < 1000 ||
        !stage ||
        !character
      ) {
        return;
      }

      const rect =
        creatorMotion.getBoundingClientRect();

      const px =
        (
          e.clientX -
          rect.left
        ) /
        rect.width -
        0.5;

      const py =
        (
          e.clientY -
          rect.top
        ) /
        rect.height -
        0.5;

      stage.style.transform =
        `
        translate3d(
          ${px * 12}px,
          ${py * 8}px,
          0
        )
        rotateY(${px * 3}deg)
        rotateX(${-py * 2}deg)
        `;

      character.style.filter =
        `
        drop-shadow(
          ${-px * 16}px
          ${-py * 10}px
          22px
          rgba(255,31,45,.16)
        )
        `;
    }
  );

  creatorMotion.addEventListener(
    'mouseleave',
    () => {
      if (
        !stage ||
        !character
      ) {
        return;
      }

      stage.style.transform =
        `
        translate3d(0,0,0)
        rotateY(0)
        rotateX(0)
        `;

      character.style.filter =
        'none';
    }
  );
}
