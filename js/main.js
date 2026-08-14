const nav =
  document.getElementById('nav');

const toggle =
  document.getElementById('menuToggle');

const glow =
  document.getElementById('cursorGlow');


// ============================================================
// MENU
// ============================================================

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


// ============================================================
// REVEAL
// ============================================================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (entry.isIntersecting) {

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
  .forEach(el => {

    observer.observe(el);

  });


// ============================================================
// CURSOR GLOW
// ============================================================

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


// ============================================================
// YEAR
// ============================================================

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
  document.getElementById('heroGauge');

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

  let mode =
    'startup';

  let nextRevTime =
    performance.now() + 5000;

  let revEndTime = 0;

  let lastFrame =
    performance.now();


  const MAX_RPM =
    9000;

  const START_ANGLE =
    -118;

  const END_ANGLE =
    118;


  // ==========================================================
  // HELPERS
  // ==========================================================

  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      Math.max(value,min),
      max
    );

  }


  function rpmToAngle(
    rpm
  ) {

    const percent =
      clamp(
        rpm / MAX_RPM,
        0,
        1
      );


    return (
      START_ANGLE +
      (
        END_ANGLE -
        START_ANGLE
      ) *
      percent
    );

  }


  function setTargetRpm(
    rpm
  ) {

    targetRpm =
      clamp(
        rpm,
        0,
        MAX_RPM
      );

  }


  // ==========================================================
  // GAUGE DRAW
  // ==========================================================

  function drawGauge(){

    if (!gaugeShell) {
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


    if (rpmDisplay) {

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


    const inRedline =
      currentRpm >= 7000;


    gaugeShell.classList.toggle(
      'redline-active',
      inRedline
    );

  }


  // ==========================================================
  // STARTUP
  // ==========================================================

  function runStartup(){

    setTargetRpm(0);


    setTimeout(
      () => {

        setTargetRpm(
          8800
        );

      },
      350
    );


    setTimeout(
      () => {

        setTargetRpm(
          2600
        );

      },
      1450
    );


    setTimeout(
      () => {

        setTargetRpm(
          7200
        );

      },
      2050
    );


    setTimeout(
      () => {

        setTargetRpm(
          1700
        );

      },
      2850
    );


    setTimeout(
      () => {

        mode =
          'idle';

      },
      3500
    );

  }


  // ==========================================================
  // ENGINE BEHAVIOUR
  // ==========================================================

  function updateEngineBehaviour(
    now
  ) {

    if (
      mode ===
      'startup'
    ) {

      return;

    }


    // --------------------------------------------------------
    // IDLING
    // --------------------------------------------------------

    if (
      mode ===
      'idle'
    ) {

      /*
        常に針が細かく揺れる。
        完全静止させない。
      */

      const idleWave =
        Math.sin(
          now / 140
        ) *
        120;


      const idleWave2 =
        Math.sin(
          now / 57
        ) *
        45;


      const idleBase =
        1550;


      setTargetRpm(
        idleBase +
        idleWave +
        idleWave2
      );


      /*
        次の空ぶかし
      */

      if (
        now >=
        nextRevTime
      ) {

        const random =
          Math.random();


        if (
          random >
          0.70
        ) {

          // 大きくREDZONEまで回す

          mode =
            'redline';

          setTargetRpm(
            7900 +
            Math.random() *
            850
          );


          revEndTime =
            now +
            1000;

        }

        else {

          // 普通の空ぶかし

          mode =
            'rev';

          setTargetRpm(
            4300 +
            Math.random() *
            1900
          );


          revEndTime =
            now +
            750;

        }

      }

    }


    // --------------------------------------------------------
    // NORMAL REV
    // --------------------------------------------------------

    else if (
      mode ===
      'rev'
    ) {

      if (
        now >=
        revEndTime
      ) {

        mode =
          'idle';


        nextRevTime =
          now +
          3500 +
          Math.random() *
          3500;

      }

    }


    // --------------------------------------------------------
    // REDLINE REV
    // --------------------------------------------------------

    else if (
      mode ===
      'redline'
    ) {

      /*
        REDZONE中も
        針を微妙に震わせる
      */

      setTargetRpm(
        8000 +
        Math.sin(
          now / 65
        ) *
        350
      );


      if (
        now >=
        revEndTime
      ) {

        mode =
          'drop';


        setTargetRpm(
          3200
        );


        revEndTime =
          now +
          550;

      }

    }


    // --------------------------------------------------------
    // RPM DROP
    // --------------------------------------------------------

    else if (
      mode ===
      'drop'
    ) {

      if (
        now >=
        revEndTime
      ) {

        mode =
          'idle';


        nextRevTime =
          now +
          4000 +
          Math.random() *
          3500;

      }

    }

  }


  // ==========================================================
  // ANIMATION LOOP
  // ==========================================================

  function animateGauge(
    now
  ) {

    const delta =
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


    updateEngineBehaviour(
      now
    );


    /*
      回転が上がる時は速く、
      落ちる時は少しゆっくり。
    */

    const responseSpeed =
      targetRpm >
      currentRpm
        ?
        8.5
        :
        4.5;


    const smoothing =
      1 -
      Math.exp(
        -responseSpeed *
        delta
      );


    currentRpm +=
      (
        targetRpm -
        currentRpm
      ) *
      smoothing;


    /*
      エンジン振動っぽい
      超微細なノイズ
    */

    if (
      mode ===
      'idle'
    ) {

      currentRpm +=
        (
          Math.random() -
          0.5
        ) *
        18;

    }


    drawGauge();


    requestAnimationFrame(
      animateGauge
    );

  }


  // ==========================================================
  // MOUSE HOVER
  // ==========================================================

  heroGauge.addEventListener(
    'mouseenter',
    () => {

      if (
        mode !==
        'startup'
      ) {

        mode =
          'manual';

        setTargetRpm(
          4800
        );

      }

    }
  );


  heroGauge.addEventListener(
    'mousemove',
    e => {

      if (
        mode ===
        'startup'
      ) {

        return;

      }


      const rect =
        heroGauge
          .getBoundingClientRect();


      const position =
        clamp(
          (
            e.clientX -
            rect.left
          ) /
          rect.width,
          0,
          1
        );


      /*
        左側 = 2000rpm
        右側 = 7000rpm
      */

      if (
        mode ===
        'manual'
      ) {

        setTargetRpm(
          2000 +
          position *
          5000
        );

      }

    }
  );


  heroGauge.addEventListener(
    'mouseleave',
    () => {

      if (
        mode !==
        'startup'
      ) {

        mode =
          'idle';


        nextRevTime =
          performance.now() +
          4000;

      }

    }
  );


  // ==========================================================
  // CLICK = FULL REV
  // ==========================================================

  heroGauge.addEventListener(
    'click',
    () => {

      if (
        mode ===
        'startup'
      ) {

        return;

      }


      mode =
        'redline';


      setTargetRpm(
        8500
      );


      revEndTime =
        performance.now() +
        1100;

    }
  );


  // ==========================================================
  // START
  // ==========================================================

  requestAnimationFrame(
    animateGauge
  );


  runStartup();

}


// ============================================================
// HERO PARALLAX
// ============================================================

const hero =
  document.querySelector(
    '.hero'
  );

const visual =
  document.querySelector(
    '.hero-visual'
  );


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
        ) *
        12;


      const y =
        (
          e.clientY /
          window.innerHeight -
          0.5
        ) *
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


// ============================================================
// PROJECT CAROUSEL
// ============================================================

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
    slides.length >
    0
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


        timer =
          null;

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
          startX ===
          null
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


        startX =
          null;


        start();

      }
    );


    viewport.addEventListener(
      'pointercancel',
      () => {

        startX =
          null;

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


// ============================================================
// CREATOR / MAR MOTION
// ============================================================

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
