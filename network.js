/* network.js — single source of truth for footer Related Tools (live-gated)
   Zero-tolerance: no hardcoded Related Tools links in HTML. */
"use strict";

window.FORBIDDEN_DOMAINS = ["tokentodollarmargin.com"];
window.NETWORK_LINKS = [
  { domain: "hourly2salarycalc.com",   name: "Hourly2SalaryCalc",   url: "https://hourly2salarycalc.com/",   live: true },
  { domain: "aftertaxsalarycalc.com",  name: "AfterTaxSalaryCalc",  url: "https://aftertaxsalarycalc.com/",  live: true },
  { domain: "takehomesalarycalc.com",  name: "TakeHomeSalaryCalc",  url: "https://takehomesalarycalc.com/",  live: true },
  { domain: "totalcompcalc.com",       name: "TotalCompCalc",       url: "https://totalcompcalc.com/",       live: true },
  { domain: "salaryvsinflation.com",   name: "SalaryVsInflation",   url: "https://salaryvsinflation.com/",   live: true }
];

(function validateNetwork() {
  var seen = Object.create(null);
  for (var i = 0; i < window.NETWORK_LINKS.length; i++) {
    var item = window.NETWORK_LINKS[i];
    if (!item || !item.domain || !item.name || !item.url) {
      throw new Error("Invalid NETWORK_LINKS entry at index " + i);
    }
    var domain = String(item.domain).toLowerCase();
    if (seen[domain]) {
      throw new Error("Duplicate domain in NETWORK_LINKS: " + domain);
    }
    if (window.FORBIDDEN_DOMAINS.indexOf(domain) !== -1) {
      throw new Error("Forbidden domain present in NETWORK_LINKS: " + domain);
    }
    seen[domain] = true;
  }
})();

window.renderRelatedTools = function renderRelatedTools(listElementId) {
  var el = document.getElementById(listElementId);
  if (!el) return;

  var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : "";
  var items = [];

  for (var i = 0; i < window.NETWORK_LINKS.length; i++) {
    var s = window.NETWORK_LINKS[i];
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
