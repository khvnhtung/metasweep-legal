(function () {
  function resolveInitialLang() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('lang') || '').toLowerCase();
    if (q === 'en' || q === 'vi') return q;
    try {
      var saved = localStorage.getItem('forms_mobile_site_lang');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (_) {}
    var nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('en') ? 'en' : 'vi';
  }

  function applyLang(lang) {
    var normalized = lang === 'en' ? 'en' : 'vi';
    document.documentElement.setAttribute('lang', normalized);
    try {
      localStorage.setItem('forms_mobile_site_lang', normalized);
    } catch (_) {}

    var buttons = document.querySelectorAll('[data-set-lang]');
    buttons.forEach(function (btn) {
      var active = btn.getAttribute('data-set-lang') === normalized;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var links = document.querySelectorAll('a[data-keep-lang]');
    links.forEach(function (a) {
      var baseHref = a.getAttribute('data-base-href') || a.getAttribute('href').split('?')[0];
      a.setAttribute('data-base-href', baseHref);
      a.setAttribute('href', baseHref + '?lang=' + normalized);
    });

    var url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== normalized) {
      url.searchParams.set('lang', normalized);
      window.history.replaceState({}, '', url.toString());
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(resolveInitialLang());
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-set-lang'));
      });
    });
  });
})();
