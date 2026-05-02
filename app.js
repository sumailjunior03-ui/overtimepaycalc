"use strict";

/* ── UTILITIES ── */
function $(id) { return document.getElementById(id); }

function fmt(amount) {
  return "$" + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ── CALC ENGINE ── */
function calculate() {
  var hourlyWage = parseFloat($("hourlyWage") ? $("hourlyWage").value : "") || 0;
  var regularHours = parseFloat($("regularHours") ? $("regularHours").value : "") || 0;
  var overtimeHours = parseFloat($("overtimeHours") ? $("overtimeHours").value : "") || 0;
  var doubleTimeEnabled = $("doubleTime") ? $("doubleTime").checked : false;
  var doubleTimeHours = doubleTimeEnabled
    ? (parseFloat($("doubleTimeHours") ? $("doubleTimeHours").value : "") || 0)
    : 0;

  if (hourlyWage <= 0) {
    var results = $("calcResults");
    if (results) results.style.display = "none";
    return;
  }
  if (regularHours < 0 || overtimeHours < 0 || doubleTimeHours < 0) return;

  var regularPay = hourlyWage * regularHours;
  var overtimeRate = hourlyWage * 1.5;
  var overtimePay = overtimeRate * overtimeHours;
  var doubleTimeRate = hourlyWage * 2;
  var doubleTimePay = doubleTimeEnabled ? doubleTimeRate * doubleTimeHours : 0;
  var totalPay = regularPay + overtimePay + doubleTimePay;

  // Straight-time comparison
  var straightTimePay = hourlyWage * (regularHours + overtimeHours + doubleTimeHours);
  var overtimeBonus = totalPay - straightTimePay;

  // Render
  $("regularPay").textContent = fmt(regularPay);
  $("overtimeRate").textContent = fmt(overtimeRate) + "/hr";
  $("overtimePay").textContent = fmt(overtimePay);

  if (doubleTimeEnabled) {
    $("doubleTimeRate").textContent = fmt(doubleTimeRate) + "/hr";
    $("doubleTimePay").textContent = fmt(doubleTimePay);
  }

  $("totalPay").textContent = fmt(totalPay);
  $("overtimeBonus").textContent = (overtimeBonus >= 0 ? "+" : "") + fmt(overtimeBonus);

  var results = $("calcResults");
  if (results) results.style.display = "block";
}

/* ── DOUBLE-TIME TOGGLE ── */
function setupDoubleTimeToggle() {
  var toggle = $("doubleTime");
  var row = $("doubleTimeRow");
  var dtResults = $("doubleTimeResults");
  if (!toggle) return;

  toggle.addEventListener("change", function () {
    var show = this.checked;
    if (row) row.style.display = show ? "block" : "none";
    if (dtResults) dtResults.style.display = show ? "block" : "none";
    if (!show && $("doubleTimeHours")) $("doubleTimeHours").value = "";
    calculate();
  });
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", function () {
  setupDoubleTimeToggle();

  ["hourlyWage", "regularHours", "overtimeHours", "doubleTimeHours"].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener("input", calculate);
  });

  // Enter key
  document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });
  });

  calculate();
});
