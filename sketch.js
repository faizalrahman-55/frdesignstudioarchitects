(() => {
  'use strict';
  const frame = document.querySelector('.drawing-frame');
  const image = frame?.querySelector('.hero-art > img');
  const replay = document.querySelector('#sketch-replay');
  if (!frame || !image || !replay) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finishTimer;
  let played = false;
  const stop = () => {
    window.clearTimeout(finishTimer);
    frame.classList.remove('sketch-running');
    replay.setAttribute('aria-disabled', 'false');
    replay.querySelector('.replay-label').textContent = 'REPLAY SKETCH';
  };
  const play = () => {
    if (reduced.matches || !image.complete || !image.naturalWidth || frame.classList.contains('sketch-running')) return;
    played = true;
    frame.classList.add('sketch-running');
    replay.setAttribute('aria-disabled', 'true');
    replay.querySelector('.replay-label').textContent = 'DRAWING…';
    finishTimer = window.setTimeout(stop, 4350);
  };
  replay.addEventListener('click', play);
  const ready = () => {
    if (!image.naturalWidth) return;
    replay.hidden = reduced.matches;
    if (!('IntersectionObserver' in window)) { play(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        if (!played) play();
        observer.disconnect();
      }
    }, {threshold: .2});
    observer.observe(frame);
  };
  if (image.complete) ready(); else image.addEventListener('load', ready, {once:true});
  reduced.addEventListener('change', () => {stop(); replay.hidden = reduced.matches;});
  document.addEventListener('visibilitychange', () => {if (document.hidden) stop();});
})();
