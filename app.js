var STORAGE_KEY = 'tg-lang';
var DEFAULT_LANG = 'ka';

function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; }
  catch (e) { return DEFAULT_LANG; }
}

function setStoredLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  var nodes = document.querySelectorAll('[data-ka], [data-en]');
  nodes.forEach(function (el) {
    var text = el.getAttribute('data-' + lang);
    if (text != null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        var ph = el.getAttribute('data-' + lang + '-placeholder');
        if (ph) el.placeholder = ph;
      } else {
        el.textContent = text;
      }
    }
  });

  document.querySelectorAll('[data-ka-placeholder], [data-en-placeholder]')
    .forEach(function (el) {
      var ph = el.getAttribute('data-' + lang + '-placeholder');
      if (ph) el.placeholder = ph;
    });

  var titleEl = document.querySelector('title');
  if (titleEl) {
    var t = titleEl.getAttribute('data-' + lang);
    if (t) titleEl.textContent = t;
  }

  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    var d = metaDesc.getAttribute('data-' + lang);
    if (d) metaDesc.setAttribute('content', d);
  }

  document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (s) {
    s.classList.toggle('active', s.getAttribute('data-lang') === lang);
  });

  resetStatCounters();
}

function toggleLanguage() {
  var current = document.documentElement.lang || DEFAULT_LANG;
  var next = current === 'ka' ? 'en' : 'ka';
  setStoredLang(next);
  applyLanguage(next);
}

var langBtn = document.getElementById('langToggle');
if (langBtn) langBtn.addEventListener('click', toggleLanguage);

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.card, .agent, .step, .quote, .faq-list details, .hero-stats, .cta-card, .tech-card, .contact-card')
  .forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

var mobileToggle = document.querySelector('.mobile-toggle');
var nav = document.querySelector('.nav');
var mobileOpen = false;

if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', function () {
    mobileOpen = !mobileOpen;
    if (mobileOpen) {
      nav.style.display = 'flex';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.flexDirection = 'column';
      nav.style.background = 'rgba(10, 10, 15, 0.97)';
      nav.style.padding = '24px';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      nav.style.backdropFilter = 'blur(16px)';
    } else {
      nav.removeAttribute('style');
    }
  });
}

document.querySelectorAll('.nav a').forEach(function (a) {
  a.addEventListener('click', function () {
    if (window.innerWidth <= 900 && nav) {
      nav.removeAttribute('style');
      mobileOpen = false;
    }
  });
});

function animateCount(el, target, suffix, duration) {
  suffix = suffix || '';
  duration = duration || 1400;
  var start = performance.now();
  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var value = Math.floor(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var STAT_CONFIG = [
  { val: 300, suffix: '%' },
  { val: 40, kaSuffix: 'სთ', enSuffix: 'H' },
  { val: 24, suffix: '/7' }
];

function resetStatCounters() {
  var heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  var lang = document.documentElement.lang || DEFAULT_LANG;
  var nums = heroStats.querySelectorAll('.stat-num');
  nums.forEach(function (n, i) {
    var cfg = STAT_CONFIG[i];
    var suf = cfg.suffix != null ? cfg.suffix : (lang === 'ka' ? cfg.kaSuffix : cfg.enSuffix);
    n.textContent = cfg.val + suf;
  });
}

var statsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var lang = document.documentElement.lang || DEFAULT_LANG;
      var nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(function (n, i) {
        var cfg = STAT_CONFIG[i];
        var suf = cfg.suffix != null ? cfg.suffix : (lang === 'ka' ? cfg.kaSuffix : cfg.enSuffix);
        animateCount(n, cfg.val, suf);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

var heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

(function () {
  function updateOptions() {
    var lang = document.documentElement.lang || DEFAULT_LANG;
    document.querySelectorAll('option[data-ka], option[data-en]').forEach(function (opt) {
      var t = opt.getAttribute('data-' + lang);
      if (t) opt.textContent = t;
    });
  }
  updateOptions();
  var obs = new MutationObserver(updateOptions);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

applyLanguage(getStoredLang());
