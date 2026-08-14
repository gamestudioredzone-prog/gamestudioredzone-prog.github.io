const nav =
  document.getElementById('nav');

const toggle =
  document.getElementById('menuToggle');

const glow =
  document.getElementById('cursorGlow');


// ==============================
// MENU
// ==============================

if (toggle && nav) {

  toggle.addEventListener(
    'click',
    () => {

      const open =
        nav.classList.toggle('open');

      toggle.setAttribute(
        'aria-expanded',
        String(open)
      );

    }
  );


  document
    .querySelectorAll('.nav a')
    .forEach(link => {

      link.addEventListener(
        'click',
        () => {

          nav.classList.remove('open');

          toggle.setAttribute(
            'aria-expanded',
            'false'
          );

        }
      );

    });

}


// ==============================
// REVEAL
// ==============================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add('visible');

          }

        }
      );

    },
    {
      threshold:0.12
    }
  );


document
  .querySelectorAll('.reveal')
  .forEach(
    el => {

      observer.observe(el);

    }
  );


// ==============================
// CURSOR GLOW
// ==============================

if (glow) {

  window.addEventListener(
    'mousemove',
    e => {

      glow.style.left =
        `${e.clientX}px`;

      glow.style.top =
        `${e.clientY}px`;

      glow.style.opacity =
        '1';

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


// ============================================================
// REDZONE TACHOMETER
// ============================================================

const heroGauge =
  document.getElementById(
    'heroGauge'
  );

if (heroGauge) {

  const gaugeShell =
    heroGauge.querySelector(
      '.gauge-shell'
    );

  const rpmDisplay =
    document.getElementById(
      'rpmValue'
    );


  let currentRpm = 0;

  let targetRpm = 0;

  let idleTimer = null;

  let redlineTimer = null;

  let lastFrame =
    performance.now();


  const minRpm = 0;

  const maxRpm = 9000;

  const startAngle = -118;

  const endAngle = 118;


  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }


  function rpmToAngle(
    rpm
  ) {

    const normalized =
      clamp(
        rpm / maxRpm,
        0,
        1
      );


    return (
      startAngle +
      normalized *
      (
        endAngle -
        startAngle
      )
    );

  }


  function updateGauge(){

    if (
      !gaugeShell
    ) {
      return;
    }


    const angle =
      rpmToAngle(
        currentRpm
      );


    gaugeShell.style.setProperty(
      '--needle-angle',
      `${angle}deg`
    );


    if (
      rpmDisplay
    ) {

      rpmDisplay.textContent =
        Math.round(
          currentRpm
        )
        .toString()
        .padStart(
          4,
          '0'
        );

    }


    gaugeShell
      .classList
      .toggle(
        'redline-active',
        currentRpm >= 7000
      );

  }


  function animationLoop(
    now
  ) {

    const dt =
      Math.min(
        (
          now -
          lastFrame
        ) /
        1000,
        0.05
      );


    lastFrame =
      now;


    const speed =
      targetRpm >
      currentRpm
        ?
        7
        :
        4;


    const smoothing =
      1 -
      Math.exp(
        -speed * dt
      );


    currentRpm +=
      (
        targetRpm -
        currentRpm
      )
      *
      smoothing;


    updateGauge();


    requestAnimationFrame(
      animationLoop
    );

  }


  function setTarget(
    rpm
  ) {

    targetRpm =
      clamp(
        rpm,
        minRpm,
        maxRpm
      );

  }


  // --------------------------------
  // START-UP SEQUENCE
  // --------------------------------

  function startupSequence(){

    setTarget(
      0
    );


    setTimeout(
      () => {

        setTarget(
          8600
        );

      },
      300
    );


    setTimeout(
      () => {

        setTarget(
          4200
        );

      },
      1450
    );


    setTimeout(
      () => {

        setTarget(
          6900
        );

      },
      2200
    );


    setTimeout(
      () => {

        setTarget(
          1350
        );

      },
      2950
    );


    setTimeout(
      () => {

        startIdle();

      },
      3700
    );

  }


  // --------------------------------
  // IDLING
  // --------------------------------

  function startIdle(){

    if (
      idleTimer
    ) {

      clearInterval(
        idleTimer
      );

    }


    idleTimer =
      setInterval(
        () => {

          const base =
            1450;

          const variance =
            450 +
            Math.random() *
            850;


          setTarget(
            base +
            variance
          );

        },
        850
      );


    scheduleRedline();

  }


  // --------------------------------
  // OCCASIONAL REV
  // --------------------------------

  function scheduleRedline(){

    if (
      redlineTimer
    ) {

      clearTimeout(
        redlineTimer
      );

    }


    const delay =
      7000 +
      Math.random() *
      6000;


    redlineTimer =
      setTimeout(
        () => {

          if (
            document.hidden
          ) {

            scheduleRedline();

            return;

          }


          setTarget(
            7600 +
            Math.random() *
            1150
          );


          setTimeout(
            () => {

              setTarget(
                3000 +
                Math.random() *
                1600
              );

            },
            700
          );


          setTimeout(
            () => {

              setTarget(
                1500 +
                Math.random() *
                600
              );

            },
            1450
          );


          scheduleRedline();

        },
        delay
      );

  }


  // --------------------------------
  // POINTER INTERACTION
  // --------------------------------

  heroGauge.addEventListener(
    'mouseenter',
    () => {

      setTarget(
        4200 +
        Math.random() *
        1500
      );

    }
  );


  heroGauge.addEventListener(
    'mouseleave',
    () => {

      setTarget(
        1600 +
        Math.random() *
        600
      );

    }
  );


  heroGauge.addEventListener(
    'click',
    () => {

      setTarget(
        8200 +
        Math.random() *
        500
      );


      setTimeout(
        () => {

          setTarget(
            1800
          );

        },
        900
      );

    }
  );


  requestAnimationFrame(
    animationLoop
  );


  startupSequence();

}


// ==============================
// HERO PARALLAX MOTION
// ==============================

const hero =
  document.querySelector('.hero');

const visual =
  document.querySelector('.hero-visual');


if (
  hero &&
  visual
) {

  hero.addEventListener(
    'mousemove',
    e => {

      if (
        window.innerWidth <
        1000
      ) {
        return;
      }


      const x =
        (
          e.clientX /
          window.innerWidth -
          0.5
        )
        *
        12;


      const y =
        (
          e.clientY /
          window.innerHeight -
          0.5
        )
        *
        9;


      visual.style.transform =
        `
        translate3d(
          ${x}px,
          ${y}px,
          0
        )
        `;

    }
  );


  hero.addEventListener(
    'mouseleave',
    () => {

      visual.style.transform =
        'translate3d(0,0,0)';

    }
  );

}


// ==============================
// PROJECT CAROUSEL
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

    let timer = null;


    const show =
      newIndex => {

        index =
          (
            newIndex +
            slides.length
          )
          %
          slides.length;


        track.style.transform =
          `
          translate3d(
            -${index * 100}%,
            0,
            0
          )
          `;


        dots.forEach(
          (
            dot,
            i
          ) => {

            const active =
              i === index;


            dot.classList.toggle(
              'active',
              active
            );


            dot.setAttribute(
              'aria-current',
              active
                ?
                'true'
                :
                'false'
            );

          }
        );

      };


    const stop =
      () => {

        if (
          timer
        ) {

          clearInterval(
            timer
          );

        }


        timer = null;

      };


    const start =
      () => {

        stop();


        timer =
          setInterval(
            () => {

              show(
                index + 1
              );

            },
            3000
          );

      };


    if (
      prev
    ) {

      prev.addEventListener(
        'click',
        () => {

          show(
            index - 1
          );

          start();

        }
      );

    }


    if (
      next
    ) {

      next.addEventListener(
        'click',
        () => {

          show(
            index + 1
          );

          start();

        }
      );

    }


    dots.forEach(
      (
        dot,
        i
      ) => {

        dot.addEventListener(
          'click',
          () => {

            show(i);

            start();

          }
        );

      }
    );


    viewport.addEventListener(
      'pointerdown',
      e => {

        startX =
          e.clientX;


        if (
          viewport
            .setPointerCapture
        ) {

          viewport
            .setPointerCapture(
              e.pointerId
            );

        }

      }
    );


    viewport.addEventListener(
      'pointerup',
      e => {

        if (
          startX === null
        ) {
          return;
        }


        const diff =
          e.clientX -
          startX;


        if (
          Math.abs(diff)
          >=
          45
        ) {

          show(
            index +
            (
              diff < 0
                ?
                1
                :
                -1
            )
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
      e => {

        if (
          e.key ===
          'ArrowLeft'
        ) {

          show(
            index - 1
          );

          start();

        }


        if (
          e.key ===
          'ArrowRight'
        ) {

          show(
            index + 1
          );

          start();

        }

      }
    );


    document.addEventListener(
      'visibilitychange',
      () => {

        if (
          document.hidden
        ) {

          stop();

        }

        else {

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


if (
  creatorMotion
) {

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
    e => {

      if (
        window.innerWidth <
        1000 ||
        !stage ||
        !character
      ) {

        return;

      }


      const rect =
        creatorMotion
          .getBoundingClientRect();


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
        rotateY(
          ${px * 3}deg
        )
        rotateX(
          ${-py * 2}deg
        )
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
