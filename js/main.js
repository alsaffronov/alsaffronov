'use strict';

const STAGGER_DELAY = 120;
const OBSERVER_THRESHOLD = 0;
const OBSERVER_MARGIN = '0px 0px -60px 0px';

const initReveal = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('reveal--visible');
    });
    return;
  }

  const staggerGroups = [
    '.works__cards',
    '.concepts__stagger-desktop',
    '.concepts__stagger-mobile',
    '.timeline__items',
  ];

  staggerGroups.forEach((parentSelector) => {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    const children = parent.querySelectorAll(':scope > .reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * STAGGER_DELAY}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('reveal--visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: OBSERVER_THRESHOLD,
    rootMargin: OBSERVER_MARGIN,
  });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
};

const initHeaderHide = () => {
  const headerButton = document.querySelector('.header__contact-button');
  const footer = document.querySelector('.footer');
  if (!headerButton || !footer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      headerButton.classList.toggle('header__contact-button--hidden', entry.isIntersecting);
    });
  }, {
    threshold: 0,
  });

  observer.observe(footer);
};

const initLightbox = () => {
  let triggerElement = null;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Увеличенное изображение');

  const img = document.createElement('img');
  img.className = 'lightbox__img';
  img.alt = '';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox__close';
  closeBtn.setAttribute('aria-label', 'Закрыть');
  closeBtn.textContent = '×';

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  const openLightbox = (src, alt) => {
    triggerElement = document.activeElement;
    img.src = src;
    img.alt = alt;
    overlay.classList.add('lightbox--open');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    overlay.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
    triggerElement = null;
  };

  const bindLightboxImage = (figImg) => {
    figImg.addEventListener('click', () => {
      const src = figImg.currentSrc || figImg.src;
      openLightbox(src, figImg.alt);
    });

    figImg.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const src = figImg.currentSrc || figImg.src;
      openLightbox(src, figImg.alt);
    });

    figImg.setAttribute('tabindex', '0');
    figImg.setAttribute('role', 'button');
    figImg.setAttribute('aria-label', `${figImg.alt} — нажмите для увеличения`);
  };

  document.querySelectorAll('.case__figure img, .concepts__figure img').forEach(bindLightboxImage);

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeaderHide();
  initLightbox();
});
