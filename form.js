var W3F_KEY = '25fe0fe6-6c7d-4af6-8af4-ac989e084944';
var TG_EMAIL = 'tropicgeorgia@gmail.com';

var cForm = document.getElementById('contactForm');
if (cForm) {
  var sBtn = cForm.querySelector('button[type="submit"]');

  cForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var lang = document.documentElement.lang || 'ka';
    var origText = sBtn ? sBtn.textContent : '';

    if (sBtn) {
      sBtn.disabled = true;
      sBtn.textContent = lang === 'ka' ? 'იგზავნება...' : 'Sending...';
    }

    var fd = new FormData(cForm);
    fd.append('access_key', W3F_KEY);
    fd.append('subject', 'Tropic Georgia — ' + (fd.get('name') || 'New inquiry'));
    fd.append('from_name', fd.get('name') || 'Tropic Georgia website');
    fd.append('replyto', fd.get('email') || '');
    fd.append('redirect', 'false');

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          alert(lang === 'ka'
            ? 'მადლობა! შეტყობინება გაიგზავნა — მალე დაგიკავშირდებით.'
            : 'Thank you! Your message was sent — we will contact you soon.');
          cForm.reset();
        } else {
          throw new Error(res.message || 'Error');
        }
      })
      .catch(function (err) {
        console.error('Form error:', err);
        alert(lang === 'ka'
          ? 'შეცდომა. მოგვწერე პირდაპირ: ' + TG_EMAIL
          : 'Error. Email us directly: ' + TG_EMAIL);
      })
      .finally(function () {
        if (sBtn) {
          sBtn.disabled = false;
          sBtn.textContent = origText;
        }
      });
  });
}
