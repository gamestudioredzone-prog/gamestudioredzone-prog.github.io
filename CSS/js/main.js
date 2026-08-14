const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');
const glow = document.getElementById('cursorGlow');

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  glow.style.opacity = '1';
});

document.getElementById('year').textContent = new Date().getFullYear();

const hero = document.querySelector('.hero');
const visual = document.querySelector('.hero-visual');

hero.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 1000) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  visual.style.transform = `translate(${x}px, ${y}px)`;
});

hero.addEventListener('mouseleave', () => {
  visual.style.transform = 'translate(0,0)';
});
