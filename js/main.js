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

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeaderHide();
});
