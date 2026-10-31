document.addEventListener('DOMContentLoaded', function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Шапка становится плотнее при прокрутке
  var header = document.querySelector('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Счётчик: 0 → итоговое число
  function countUp(el) {
    if (!el || reduce) return;
    var original = el.textContent.trim();
    var m = original.match(/^([\d\s]+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1].replace(/\s/g, ''), 10);
    var suffix = m[2];
    var start = performance.now();
    var duration = 1500;
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString('ru-RU') + suffix;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = original;
      }
    }
    requestAnimationFrame(tick);
  }

  // Плавное появление блоков при прокрутке
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('visible');
      observer.unobserve(el);
      if (el.classList.contains('stat')) {
        countUp(el.querySelector('.stat-number'));
      }
    });
  }, { threshold: 0.15 });

  var selector = '.stat, .about h2, .about p, .services h2, .card, ' +
    '.videos h2, .videos p, .video-frame, .contacts h2, .contacts p, .contact-links';

  document.querySelectorAll(selector).forEach(function (el) {
    var index = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--d', (index * 0.12) + 's');
    el.classList.add('reveal');
    observer.observe(el);
  });
});
