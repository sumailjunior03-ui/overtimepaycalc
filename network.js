/* network.js — single source of truth for footer Related Tools (live-gated)
   Zero-tolerance: no hardcoded Related Tools links in HTML. */
"use strict";

window.FORBIDDEN_DOMAINS = ["tokentodollarmargin.com"];

window.CALC_HQ_NETWORK = [
  { domain: "calc-hq.com", name: "Calc-HQ", url: "https://calc-hq.com/", live: true }
];

(function validateNetwork() {
  var seen = Object.create(null);
  for (var i = 0; i < window.CALC_HQ_NETWORK.length; i++) {
    var item = window.CALC_HQ_NETWORK[i];
    if (!item || !item.domain || !item.name || !item.url) {
      throw new Error("Invalid CALC_HQ_NETWORK entry at index " + i);
    }
    var domain = String(item.domain).toLowerCase();
    if (seen[domain]) {
      throw new Error("Duplicate domain in CALC_HQ_NETWORK: " + domain);
    }
    if (window.FORBIDDEN_DOMAINS.indexOf(domain) !== -1) {
      throw new Error("Forbidden domain present in CALC_HQ_NETWORK: " + domain);
    }
    seen[domain] = true;
  }
})();

window.renderRelatedTools = function renderRelatedTools(listElementId) {
  var el = document.getElementById(listElementId);
  if (!el) return;

  var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : "";
  var items = [];

  for (var i = 0; i < window.CALC_HQ_NETWORK.length; i++) {
    var s = window.CALC_HQ_NETWORK[i];
    if (!s || !s.domain || !s.url) continue;

    var domain = String(s.domain).toLowerCase();
    if (s.live !== true) continue;
    if (window.FORBIDDEN_DOMAINS.indexOf(domain) !== -1) continue;
    if (host && domain === host) continue;

    items.push(s);
  }

  items.sort(function(a, b) {
    return String(a.name).localeCompare(String(b.name));
  });

  var html = "";
  for (var j = 0; j < items.length; j++) {
    html += '<li><a href="' + items[j].url + '">' + items[j].name + '</a></li>';
  }

  el.innerHTML = html;
};
