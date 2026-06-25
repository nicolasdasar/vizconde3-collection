/* Vizconde de Matamala 3 — V2 JavaScript */
(function () {
  'use strict';

  /* ── HEADER SCROLL ── */
  const header = document.getElementById('header');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  /* ── BURGER / MOBILE NAV ── */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', !open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  window.closeMobileNav = function () {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /* ── HERO SLIDER ── */
  (function () {
    const slides = document.querySelectorAll('.hero-slide');
    const indCont = document.getElementById('heroIndicators');
    const count = document.getElementById('heroCount');
    let cur = 0, timer;
    const total = slides.length;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'hi-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      indCont.appendChild(d);
    });

    function goTo(n) {
      slides[cur].classList.remove('active');
      document.querySelectorAll('.hi-dot')[cur].classList.remove('active');
      cur = (n + total) % total;
      slides[cur].classList.add('active');
      document.querySelectorAll('.hi-dot')[cur].classList.add('active');
      if (count) count.textContent = (cur + 1) + ' / ' + total;
      clearInterval(timer);
      timer = setInterval(() => goTo(cur + 1), 5500);
    }

    document.getElementById('heroPrev')?.addEventListener('click', () => goTo(cur - 1));
    document.getElementById('heroNext')?.addEventListener('click', () => goTo(cur + 1));

    // Touch swipe
    let tx = 0;
    const hero = document.getElementById('hero');
    hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? goTo(cur + 1) : goTo(cur - 1);
    }, { passive: true });

    timer = setInterval(() => goTo(cur + 1), 5500);
  })();

  /* ── TIPOLOGÍA SELECTOR ── */
  (function () {
    const btns = document.querySelectorAll('.ts-btn');
    const panels = document.querySelectorAll('.tipo-content');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById('tc-' + btn.dataset.t);
        if (panel) panel.classList.add('active');
      });
    });
  })();

  /* ── PLANTA P1 / P2 TOGGLE ── */
  (function () {
    const tagLabels = { '1a': ['Vivienda 1A · Planta 1', 'Vivienda 2A · Planta 2'], '1b': ['Vivienda 1B · Planta 1', 'Vivienda 2B · Planta 2'], '1c': ['Vivienda 1C · Planta 1', 'Vivienda 2C · Planta 2'] };
    document.querySelectorAll('.planta-toggle').forEach(toggle => {
      const tipo = toggle.dataset.tipo;
      const plBtns = toggle.querySelectorAll('.pl-btn');
      const tag = document.getElementById('tag-' + tipo);
      const panel = toggle.closest('.tipo-content');
      plBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          plBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const planta = btn.dataset.planta; // 'p1' or 'p2'
          if (tag && tagLabels[tipo]) tag.textContent = tagLabels[tipo][i];
          panel.querySelectorAll('.pl-val').forEach(el => {
            el.textContent = el.dataset[planta] || el.textContent;
          });
        });
      });
    });
  })();

  /* ── THUMBNAIL GALLERY ── */
  document.querySelectorAll('.tg-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const img = thumb.dataset.img;
      const targetId = thumb.dataset.target;
      const mainImg = document.getElementById(targetId);
      if (!mainImg || !img) return;
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = img;
        mainImg.style.opacity = '1';
      }, 250);
      const container = thumb.closest('.tg-thumbs');
      container.querySelectorAll('.tg-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
  // Smooth fade for main images
  document.querySelectorAll('.tg-hero').forEach(img => {
    img.style.transition = 'opacity 0.35s ease';
  });

  /* ── STAT COUNTER ── */
  function animCount(el) {
    const t = parseInt(el.dataset.count);
    if (isNaN(t)) return;
    let c = 0;
    const step = Math.ceil(t / 30);
    const iv = setInterval(() => {
      c = Math.min(c + step, t);
      el.textContent = c;
      if (c >= t) clearInterval(iv);
    }, 40);
  }

  /* ── INTERSECTION OBSERVER (scroll reveal + counters) ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('[data-count]').forEach(animCount);
        if (e.target.hasAttribute('data-count')) animCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  /* ── SMOOTH SCROLL ── */
  window.scrollTo = function (selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : null;
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 80);
      window.scroll({ top, behavior: 'smooth' });
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 80);
        window.scroll({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── BACK TO TOP ── */
  backTop.addEventListener('click', () => window.scroll({ top: 0, behavior: 'smooth' }));

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!document.getElementById('nombre')?.value.trim() ||
        !document.getElementById('email')?.value.trim() ||
        !document.getElementById('privacy')?.checked) {
      alert('Por favor, completa los campos obligatorios y acepta la política de privacidad.');
      return;
    }
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      if (success) { success.style.display = 'block'; }
    }, 1200);
  });

  console.log('✦ VCM3 V2 — DASAR Gestión · Loaded');
})();
