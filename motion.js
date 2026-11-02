(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const make = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    element.setAttribute('aria-hidden', 'true');
    return element;
  };

  // An event-driven progress bar; no timer or continuous animation loop.
  const progress = make('div', 'fr-scroll-progress');
  document.body.append(progress);
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const distance = root.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
  };
  const scheduleProgress = () => {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();

  // Content is visible by default. Only an arriving element receives an
  // animation, so unavailable observers or JavaScript cannot hide a section.
  const revealSelector = [
    '.section-heading', '.project-card', '.studio-grid > div',
    '.services-intro', '.service-list > details', '.process-heading',
    '.process-steps > article', '.contact-heading', '.contact-grid > div',
    '.legal-hero', '.legal-section', '.policy-section', '[data-reveal]'
  ].join(',');
  const seen = new WeakSet();
  let revealObserver;
  const removeRevealClasses = element => {
    element.classList.remove('fr-motion-enter', 'fr-motion-delay-1', 'fr-motion-delay-2', 'fr-motion-delay-3');
  };
  const reveal = element => {
    if (seen.has(element) || element.hidden) return;
    seen.add(element);
    revealObserver?.unobserve(element);
    if (reducedMotion.matches) return;
    const group = element.parentElement;
    const siblings = group ? [...group.children].filter(child => child.matches(revealSelector) && !child.hidden) : [];
    const delay = Math.min(3, Math.max(0, siblings.indexOf(element)));
    if (delay) element.classList.add(`fr-motion-delay-${delay}`);
    element.classList.add('fr-motion-enter');
    element.addEventListener('animationend', () => removeRevealClasses(element), { once: true });
    // Animation cancellation, removed nodes, or overridden CSS cannot leave
    // a lasting transform or opacity behind.
    window.setTimeout(() => removeRevealClasses(element), 1200);
  };
  const observeReveals = () => {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
      }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    }
    document.querySelectorAll(revealSelector).forEach(element => {
      if (!seen.has(element)) revealObserver.observe(element);
    });
  };
  observeReveals();
  // The gallery can dispatch this after adding or replacing project cards.
  document.addEventListener('fr:content-updated', observeReveals);

  const cursor = make('div', 'fr-cursor-layer');
  const head = make('div', 'fr-cursor-head');
  head.append(make('span', 'fr-cursor-pin'));
  const ring = make('div', 'fr-cursor-ring');
  ring.append(make('span', 'fr-cursor-ring-shape'));
  cursor.append(ring, head);
  document.body.append(cursor);

  const nativeTarget = 'input, textarea, select, option, [contenteditable], iframe, video, audio';
  const interactiveTarget = 'a, button, summary, [role="button"], [data-project], [data-cursor="interactive"]';
  let cursorFrame = 0;
  let initialized = false;
  let targetX = 0;
  let targetY = 0;
  let ringX = 0;
  let ringY = 0;
  let lastTime = 0;
  let isInside = false;
  let currentTarget = null;

  const allowed = () => finePointer.matches && !reducedMotion.matches && !document.hidden;
  const modalIsOpen = () => Boolean(document.querySelector('dialog[open]'));
  const hideCursor = () => {
    root.classList.remove('fr-cursor-active');
    cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
    if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    initialized = false;
    lastTime = 0;
  };
  const transformAt = (element, x, y) => { element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`; };
  const moveRing = time => {
    cursorFrame = 0;
    if (!allowed() || !isInside || !root.classList.contains('fr-cursor-active')) return;
    const elapsed = lastTime ? Math.min(48, time - lastTime) : 16;
    lastTime = time;
    const ease = 1 - Math.pow(.76, elapsed / 16.67);
    ringX += (targetX - ringX) * ease;
    ringY += (targetY - ringY) * ease;
    if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) < .15) {
      ringX = targetX; ringY = targetY; lastTime = 0;
    } else cursorFrame = window.requestAnimationFrame(moveRing);
    transformAt(ring, ringX, ringY);
  };
  const refreshTarget = target => {
    currentTarget = target instanceof Element ? target : null;
    if (!allowed() || !isInside || modalIsOpen() || currentTarget?.closest(nativeTarget)) {
      hideCursor();
      return false;
    }
    root.classList.add('fr-cursor-active');
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-interactive', Boolean(currentTarget?.closest(interactiveTarget)));
    return true;
  };
  const onPointerMove = event => {
    if (event.pointerType && event.pointerType !== 'mouse') { hideCursor(); return; }
    targetX = event.clientX; targetY = event.clientY; isInside = true;
    if (!refreshTarget(event.target)) return;
    if (!initialized) {
      ringX = targetX; ringY = targetY; initialized = true;
      transformAt(ring, ringX, ringY);
    }
    transformAt(head, targetX, targetY);
    if (!cursorFrame) cursorFrame = window.requestAnimationFrame(moveRing);
  };
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse' && initialized) refreshTarget(event.target);
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) { isInside = false; hideCursor(); }
  }, { passive: true });
  window.addEventListener('blur', () => { isInside = false; hideCursor(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { isInside = false; hideCursor(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') hideCursor();
  });
  // The native pointer returns immediately when a dialog enters the top layer.
  const modalObserver = new MutationObserver(() => {
    if (modalIsOpen()) hideCursor();
  });
  document.querySelectorAll('dialog').forEach(dialog => modalObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] }));

  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || !root.classList.contains('fr-cursor-active')) return;
    cursor.classList.add('is-pressed');
    const ripple = make('div', 'fr-click-ripple');
    ripple.append(make('span', 'fr-click-ripple-shape'));
    transformAt(ripple, event.clientX, event.clientY);
    cursor.append(ripple);
    const ripples = cursor.querySelectorAll('.fr-click-ripple');
    if (ripples.length > 4) ripples[0].remove();
    window.setTimeout(() => ripple.remove(), 650);
  }, { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
  document.addEventListener('pointercancel', hideCursor, { passive: true });

  const resetPreferences = () => {
    hideCursor();
    if (reducedMotion.matches) {
      revealObserver?.disconnect();
      document.querySelectorAll('.fr-motion-enter').forEach(removeRevealClasses);
    } else observeReveals();
  };
  reducedMotion.addEventListener('change', resetPreferences);
  finePointer.addEventListener('change', resetPreferences);
})();
