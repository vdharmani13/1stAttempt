/* ============================================================
   DHARMANI ADVOCATES — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar scroll behaviour ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const isTransparent = navbar.classList.contains('nav--transparent');
    const onScroll = () => {
      if (isTransparent) {
        navbar.classList.toggle('nav--solid', window.scrollY > 60);
        navbar.classList.toggle('nav--transparent', window.scrollY <= 60);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav burger ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate burger to X
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
        spans[1].style.cssText = 'opacity: 0';
        spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => s.style.cssText = '');
      }
    });

    // Close on mobile link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        burger.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Animated counter ---------- */
  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const isNumeric = !isNaN(parseInt(target));
    if (!isNumeric) return; // skip non-numeric like "Pan‑India"

    const numTarget = parseInt(target);
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * numTarget) + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const numEls = statsSection.querySelectorAll('.stats__num');
    let animated = false;

    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        numEls.forEach(el => {
          const raw = el.textContent.trim();
          const suffix = raw.replace(/[\d]/g, '');
          const num = raw.replace(/[^\d]/g, '');
          if (num) animateCounter(el, num, suffix, 1600);
        });
      }
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 80;
        const extra = document.querySelector('.practice-nav-tabs') ? 56 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - extra - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
    else link.classList.remove('active');
  });

})();
