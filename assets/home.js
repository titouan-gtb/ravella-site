// Accueil : en-tête au défilement, apparitions, carrousel d'écrans, flèches des cartes.
// Sans bibliothèque, sans traceur. La page reste lisible sans ce fichier.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En-tête : fond plus marqué une fois qu'on a défilé.
  var top = document.querySelector('.top');
  function onScroll() {
    if (top) top.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Apparition au défilement.
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || still) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Carrousel d'écrans.
  var box = document.querySelector('[data-carousel]');
  if (box) {
    var slides = box.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.showcase .dot');
    var caption = document.querySelector('.slide-caption');
    var i = 0, timer = null;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-on', k === i);
        d.setAttribute('aria-pressed', String(k === i));
      });
      if (caption && dots[i]) caption.textContent = dots[i].getAttribute('aria-label');
    }
    function play() { if (!still && !timer) timer = setInterval(function () { show(i + 1); }, 3800); }
    function pause() { clearInterval(timer); timer = null; }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { pause(); show(k); }); });
    var fig = box.closest('figure');
    fig.addEventListener('mouseenter', pause);
    fig.addEventListener('mouseleave', play);
    fig.addEventListener('focusin', pause);
    box.addEventListener('click', function () { pause(); show(i + 1); });
    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : play(); });
    play();
  }

  // Flèches des cartes story.
  document.querySelectorAll('.row-nav').forEach(function (nav) {
    var row = document.getElementById(nav.getAttribute('data-for'));
    if (!row) return;
    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = row.querySelector('li');
        var step = card ? card.getBoundingClientRect().width + 14 : 280;
        row.scrollBy({ left: step * Number(b.getAttribute('data-dir')), behavior: still ? 'auto' : 'smooth' });
      });
    });
  });
})();
