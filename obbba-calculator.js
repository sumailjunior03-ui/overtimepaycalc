"use strict";

/* ── UTILITIES ── */
function $(id) { return document.getElementById(id); }

function fmt(amount) {
  return "$" + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ── OBBBA CALCULATION ENGINE ── */

// Constants (IRC §225, Public Law 119-21)
var OBBBA = {
  CAP_SINGLE: 12500,
  CAP_MFJ: 25000,
  THRESHOLD_SINGLE: 150000,
  THRESHOLD_MFJ: 300000,
  PHASEOUT_RATE: 100,    // $100 reduction per $1,000 excess MAGI
  PHASEOUT_STEP: 1000,   // $1,000 MAGI increments
  PREMIUM_MULTIPLIER: 0.5, // the "half" in time-and-a-half
  TAX_YEARS: "2025–2028"
};

/**
 * Calculate the OBBBA overtime deduction.
 *
 * @param {number} hourlyWage     - Regular hourly rate
 * @param {number} overtimeHours  - OT hours per week
 * @param {number} weeksWorked    - Weeks with OT per year
 * @param {string} filingStatus   - "single" or "mfj"
 * @param {number} magi           - Modified Adjusted Gross Income
 * @returns {object} Full breakdown
 */
function computeOBBBADeduction(hourlyWage, overtimeHours, weeksWorked, filingStatus, magi) {
  var isMFJ = filingStatus === "mfj";
  var cap = isMFJ ? OBBBA.CAP_MFJ : OBBBA.CAP_SINGLE;
  var threshold = isMFJ ? OBBBA.THRESHOLD_MFJ : OBBBA.THRESHOLD_SINGLE;

  // Step 1: Overtime rate and premium
  var overtimeRate = hourlyWage * 1.5;
  var premiumRate = hourlyWage * OBBBA.PREMIUM_MULTIPLIER;

  // Step 2: Annual premium pay (the deductible portion)
  var annualPremium = premiumRate * overtimeHours * weeksWorked;

  // Step 3: MAGI phase-out
  var excessMAGI = Math.max(0, magi - threshold);
  var phaseoutReduction = Math.floor(excessMAGI / OBBBA.PHASEOUT_STEP) * OBBBA.PHASEOUT_RATE;

  // Step 4: Adjusted cap
  var adjustedCap = Math.max(0, cap - phaseoutReduction);

  // Step 5: Deduction = lesser of annual premium or adjusted cap
  var deduction = Math.min(annualPremium, adjustedCap);

  return {
    overtimeRate: overtimeRate,
    premiumRate: premiumRate,
    annualPremium: annualPremium,
    cap: cap,
    excessMAGI: excessMAGI,
    phaseoutReduction: phaseoutReduction,
    adjustedCap: adjustedCap,
    deduction: deduction,
    hasPhaseout: excessMAGI > 0
  };
}

/* ── RENDER ── */
function calculateOBBBA() {
  var hourlyWage = parseFloat($("hourlyWage") ? $("hourlyWage").value : "") || 0;
  var overtimeHours = parseFloat($("overtimeHours") ? $("overtimeHours").value : "") || 0;
  var weeksWorked = parseFloat($("weeksWorked") ? $("weeksWorked").value : "") || 0;
  var filingStatus = $("filingStatus") ? $("filingStatus").value : "single";
  var magi = parseFloat($("magi") ? $("magi").value : "") || 0;
  var taxBracket = parseFloat($("taxBracket") ? $("taxBracket").value : "") || 0.22;

  if (hourlyWage <= 0 || overtimeHours <= 0 || weeksWorked <= 0) {
    var results = $("calcResults");
    if (results) results.style.display = "none";
    return;
  }

  var r = computeOBBBADeduction(hourlyWage, overtimeHours, weeksWorked, filingStatus, magi);

  // Tax savings estimate
  var taxSavings = r.deduction * taxBracket;

  // Render
  $("resOvertimeRate").textContent = fmt(r.overtimeRate) + "/hr";
  $("resPremiumRate").textContent = fmt(r.premiumRate) + "/hr";
  $("resAnnualPremium").textContent = fmt(r.annualPremium);
  $("resCap").textContent = fmt(r.cap);

  // Phase-out row
  var phaseoutRow = $("phaseoutRow");
  if (r.hasPhaseout) {
    phaseoutRow.style.display = "flex";
    $("resPhaseout").textContent = "−" + fmt(r.phaseoutReduction);
  } else {
    phaseoutRow.style.display = "none";
  }

  $("resAdjustedCap").textContent = fmt(r.adjustedCap);
  $("resDeduction").textContent = fmt(r.deduction);
  $("resTaxSavings").textContent = fmt(taxSavings);

  var results = $("calcResults");
  if (results) results.style.display = "block";
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", function () {
  ["hourlyWage", "overtimeHours", "weeksWorked", "magi"].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener("input", calculateOBBBA);
  });

  $("filingStatus").addEventListener("change", calculateOBBBA);
  $("taxBracket").addEventListener("change", calculateOBBBA);

  // Initial calculation
  calculateOBBBA();
});
