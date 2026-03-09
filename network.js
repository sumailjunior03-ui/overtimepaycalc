/* network.js — single source of truth for footer Related Tools (live-gated)
   Zero-tolerance: no hardcoded Related Tools links in HTML. */
"use strict";

var CALC_HQ_NETWORK = [
  { domain: "calc-hq.com",             name: "Calc HQ",                 url: "https://calc-hq.com/",               live: true },
  { domain: "bizdaychecker.com",       name: "BizDayChecker",           url: "https://bizdaychecker.com/",         live: true },
  { domain: "bankcutoffchecker.com",   name: "BankCutoffChecker",       url: "https://bankcutoffchecker.com/",     live: true },
  { domain: "salaryvsinflation.com",   name: "SalaryVsInflation",       url: "https://salaryvsinflation.com/",     live: true },
  { domain: "hourly2salarycalc.com",   name: "Hourly2SalaryCalc",       url: "https://hourly2salarycalc.com/",     live: true },
  { domain: "payrolldatechecker.com",  name: "PayrollDateChecker",      url: "https://payrolldatechecker.com/",    live: true },
  { domain: "1099vsw2calc.com",        name: "1099vsW2Calc",            url: "https://1099vsw2calc.com/",          live: true },
  { domain: "freelanceincomecalc.com", name: "FreelanceIncomeCalc",     url: "https://freelanceincomecalc.com/",   live: true },
  { domain: "quarterlytaxcalc.com",    name: "QuarterlyTaxCalc",        url: "https://quarterlytaxcalc.com/",      live: true },
  { domain: "totalcompcalc.com",       name: "TotalCompCalc",           url: "https://totalcompcalc.com/",         live: true },
  { domain: "overtimepaycalc.com",     name: "OvertimePayCalc",         url: "https://overtimepaycalc.com/",       live: true },
  { domain: "aftertaxsalarycalc.com",  name: "AfterTaxSalaryCalc",      url: "https://aftertaxsalarycalc.com/",    live: true },
  { domain: "takehomepaycalc.com",     name: "TakeHomePayCalc",         url: "https://takehomepaycalc.com/",       live: true }
];

function renderRelatedTools(listElementId) {
  var el = document.getElementById(listElementId);
  if (!el) return;

  var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : "";
  var items = [];

  for (var i = 0; i < CALC_HQ_NETWORK.length; i++) {
    var s = CALC_HQ_NETWORK[i];
    if (!s || !s.domain || !s.url) continue;

    var domain = String(s.domain).toLowerCase();
    if (s.live !== true) continue;
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
}

window.renderRelatedTools = renderRelatedTools;
