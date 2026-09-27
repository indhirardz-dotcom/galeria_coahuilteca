/* GA4 events for meaningful actions on Galería Coahuilteca. */
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function track(eventName, parameters) {
    window.gtag('event', eventName, Object.assign({ transport_type: 'beacon' }, parameters || {}));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a');
    if (!link) return;

    if (link.matches('[data-gumroad-overlay-checkout="true"]') || /(^|\.)gumroad\.com\//i.test(link.href)) {
      var card = link.closest('article, .product-card, .art-card, .product');
      var heading = card && card.querySelector('h2, h3, .product-title');
      track('begin_checkout', {
        item_id: link.href.split('/l/')[1] || link.pathname,
        item_name: heading ? heading.textContent.trim() : link.textContent.trim(),
        checkout_provider: 'gumroad'
      });
      return;
    }

    if (/^https?:\/\/(www\.)?wa\.me\//i.test(link.href)) {
      var message = '';
      try { message = new URL(link.href).searchParams.get('text') || ''; } catch (_) {}
      var lower = (message + ' ' + link.textContent).toLowerCase();
      var leadType = /portrait|retrato/.test(lower) ? 'portrait'
        : /experience|class|workshop|experiencia|clase|taller/.test(lower) ? 'art_experience'
        : /artwork|available|obra|disponible|collection|coleccion/.test(lower) ? 'artwork_inquiry'
        : 'general_inquiry';
      track('generate_lead', { method: 'whatsapp', lead_type: leadType });
    }
  }, true);

  document.querySelectorAll('audio').forEach(function (audio, index) {
    var started = false;
    var sentProgress = {};
    var source = audio.querySelector('source');
    var label = audio.previousElementSibling;
    var language = label ? label.textContent.replace(/^Audio\s*(in|en)\s*/i, '').trim() : 'unknown';
    var audioName = source ? source.getAttribute('src').split('/').pop() : 'audio-' + (index + 1);
    var parameters = { audio_title: document.title, audio_language: language, audio_file: audioName };

    audio.addEventListener('play', function () {
      if (started) return;
      started = true;
      track('audio_start', parameters);
    });

    audio.addEventListener('timeupdate', function () {
      if (!started || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
      var percent = Math.floor((audio.currentTime / audio.duration) * 100);
      [25, 50, 75].forEach(function (threshold) {
        if (percent >= threshold && !sentProgress[threshold]) {
          sentProgress[threshold] = true;
          track('audio_progress', Object.assign({ audio_percent: threshold }, parameters));
        }
      });
    });

    audio.addEventListener('ended', function () {
      if (started) track('audio_complete', Object.assign({ audio_percent: 100 }, parameters));
    });
  });

  window.gcTrackAnalyticsEvent = track;
})();
