/* GA4 events for meaningful actions on Galería Coahuilteca. */
(function () {
  function track(eventName, parameters) {
    if (typeof window.gtag !== 'function') return;
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

  window.gcTrackAnalyticsEvent = track;
})();
