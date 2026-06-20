/**
 * Saans — Google Analytics
 */
(function () {
  'use strict';

  window.initAnalytics = function () {
    var id = SAANS_CONFIG && SAANS_CONFIG.GA_MEASUREMENT_ID;
    if (!id) return;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', id);
  };
})();
