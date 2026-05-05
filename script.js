// ============================================
// LANGUAGE SWITCHER (KA / EN)
// ============================================
const STORAGE_KEY = 'mediator-lang';
const DEFAULT_LANG = 'ka';

function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; }
  catch { return DEFAULT_LANG; }
}

function setStoredLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  // Translate all elements with data-ka / data-en
  const nodes = document.querySelectorAll('[data-ka], [data-en]');
  nodes.forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text != null) {
      // For inputs use placeholder
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const ph = el.getAttribute(`data-${lang}-placeholder`);
        if (ph) el.placeholder = ph;
      } else {
        el.textContent = text;
      }
    }
  });

  // Placeholders specifically (input fields)
  document.querySelectorAll('[data-ka-placeholder], [data-en-placeholder]')
    .forEach((el) => {
      const ph = el.getAttribute(`data-${lang}-placeholder`);
      if (ph) el.placeholder = ph;
    });

  // Update <title> tag
  const titleEl = document.querySelector('title');
  if (titleEl) {
    const t = titleEl.getAttribute(`data-${lang}`);
    if (t) titleEl.textContent = t;
  }

  // Update <meta description>
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const d = metaDesc.getAttribute(`data-${lang}`);
    if (d) metaDesc.setAttribute('content', d);
  }

  // Lang toggle visual state
  document.querySelectorAll('.lang-toggle [data-lang]').forEach((s) => {
    s.classList.toggle('active', s.getAttribute('data-lang') === lang);
  });

  // Re-trigger stat counter with correct suffix
  resetStatCounters();
}

function toggleLanguage() {
  const current = document.documentElement.lang || DEFAULT_LANG;
  const next = current === 'ka' ? 'en' : 'ka';
  setStoredLang(next);
  applyLanguage(next);
}

const langBtn = document.getElementById('langToggle');
if (langBtn) langBtn.addEventListener('click', toggleLanguage);
// (applyLanguage is invoked at the end of this file once STAT_CONFIG is defined)


// ============================================
// SCROLL REVEAL
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.card, .agent, .step, .quote, .faq-list details, .hero-stats, .cta-card')
  .forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });


// ============================================
// MOBILE MENU
// ============================================
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');
let mobileOpen = false;

if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    if (mobileOpen) {
      Object.assign(nav.style, {
        display: 'flex',
        position: 'absolute',
        top: '72px',
        left: '0',
        right: '0',
        flexDirection: 'column',
        background: 'rgba(10, 10, 15, 0.97)',
        padding: '24px',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
      });
    } else {
      nav.removeAttribute('style');
    }
  });
}

document.querySelectorAll('.nav a').forEach((a) => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900 && nav) {
      nav.removeAttribute('style');
      mobileOpen = false;
    }
  });
});


// ============================================
// ANIMATED STAT COUNTERS
// ============================================
function animateCount(el, target, prefix = '', suffix = '', duration = 1400) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const STAT_CONFIG = [
  { val: 300, suffix: '%' },
  { val: 40, kaSuffix: 'სთ', enSuffix: 'H' },
  { val: 24, suffix: '/7' },
];

function resetStatCounters() {
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  const lang = document.documentElement.lang || DEFAULT_LANG;
  const nums = heroStats.querySelectorAll('.stat-num');
  nums.forEach((n, i) => {
    const cfg = STAT_CONFIG[i];
    const suf = cfg.suffix ?? (lang === 'ka' ? cfg.kaSuffix : cfg.enSuffix);
    n.textContent = cfg.val + suf;
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const lang = document.documentElement.lang || DEFAULT_LANG;
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach((n, i) => {
        const cfg = STAT_CONFIG[i];
        const suf = cfg.suffix ?? (lang === 'ka' ? cfg.kaSuffix : cfg.enSuffix);
        animateCount(n, cfg.val, '', suf);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


// ============================================
// CONTACT FORM — sends directly to tropicgeorgia@gmail.com via Web3Forms
// Requires an Access Key from https://web3forms.com (free, no signup)
// Replace the value below after getting the key (see instructions in chat).
// ============================================
const WEB3FORMS_ACCESS_KEY = '25fe0fe6-6c7d-4af6-8af4-ac989e084944';
const CONTACT_EMAIL = 'tropicgeorgia@gmail.com';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = document.documentElement.lang || DEFAULT_LANG;
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'ka' ? 'იგზავნება...' : 'Sending...';
    }

    const formData = new FormData(contactForm);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `Tropic Georgia — ${formData.get('name') || 'New inquiry'}`);
    formData.append('from_name', formData.get('name') || 'Tropic Georgia website');
    formData.append('replyto', formData.get('email') || '');
    formData.append('redirect', 'false');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        const okMsg = lang === 'ka'
          ? 'მადლობა! შეტყობინება გაიგზავნა — მალე დაგიკავშირდებით.'
          : 'Thank you! Your message was sent — we will contact you soon.';
        alert(okMsg);
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Web3Forms error');
      }
    } catch (err) {
      console.error('Form error:', err);
      const errMsg = lang === 'ka'
        ? `შეცდომა: ${err.message}\n\nმოგვწერე პირდაპირ: ${CONTACT_EMAIL}`
        : `Error: ${err.message}\n\nEmail us directly: ${CONTACT_EMAIL}`;
      alert(errMsg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}


// Translate <option> elements (data-ka/data-en on options)
(function translateOptions() {
  const updateOptions = () => {
    const lang = document.documentElement.lang || DEFAULT_LANG;
    document.querySelectorAll('option[data-ka], option[data-en]').forEach((opt) => {
      const t = opt.getAttribute(`data-${lang}`);
      if (t) opt.textContent = t;
    });
  };
  updateOptions();
  // Re-run when language changes (observer)
  const obs = new MutationObserver(updateOptions);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

// ============================================
// Apply stored language on load (after STAT_CONFIG/resetStatCounters are defined)
// ============================================
applyLanguage(getStoredLang());
