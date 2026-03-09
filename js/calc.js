// ============================================
// OVERTIME PAY CALCULATOR — core logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // Double-time toggle
  const doubleTimeToggle = document.getElementById('doubleTime');
  const doubleTimeRow = document.getElementById('doubleTimeRow');
  const doubleTimeResults = document.getElementById('doubleTimeResults');

  if (doubleTimeToggle) {
    doubleTimeToggle.addEventListener('change', function () {
      if (this.checked) {
        doubleTimeRow.style.display = 'block';
        doubleTimeResults.style.display = 'block';
      } else {
        doubleTimeRow.style.display = 'none';
        doubleTimeResults.style.display = 'none';
        document.getElementById('doubleTimeHours').value = '';
      }
    });
  }

  // Allow Enter key to trigger calculation
  document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculate();
    });
  });

});

function calculate() {
  const hourlyWage = parseFloat(document.getElementById('hourlyWage').value) || 0;
  const regularHours = parseFloat(document.getElementById('regularHours').value) || 0;
  const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
  const doubleTimeEnabled = document.getElementById('doubleTime').checked;
  const doubleTimeHours = doubleTimeEnabled
    ? parseFloat(document.getElementById('doubleTimeHours').value) || 0
    : 0;

  // Validation
  if (hourlyWage <= 0) {
    showError('Please enter a valid hourly wage.');
    return;
  }
  if (regularHours < 0 || overtimeHours < 0 || doubleTimeHours < 0) {
    showError('Hours cannot be negative.');
    return;
  }

  // Core calculations
  const regularPay = hourlyWage * regularHours;
  const overtimeRate = hourlyWage * 1.5;
  const overtimePay = overtimeRate * overtimeHours;
  const doubleTimeRate = hourlyWage * 2;
  const doubleTimePay = doubleTimeRate * doubleTimeHours;
  const totalPay = regularPay + overtimePay + doubleTimePay;

  // Update DOM
  setResult('regularPay', fmt(regularPay));
  setResult('overtimeRate', fmt(overtimeRate) + ' / hr');
  setResult('overtimePay', fmt(overtimePay));

  if (doubleTimeEnabled) {
    setResult('doubleTimeRate', fmt(doubleTimeRate) + ' / hr');
    setResult('doubleTimePay', fmt(doubleTimePay));
  }

  setResult('totalPay', fmt(totalPay));

  // Highlight the results card
  const resultsCard = document.getElementById('calcResults');
  resultsCard.style.borderColor = 'var(--accent)';
  setTimeout(() => {
    resultsCard.style.borderColor = '';
    resultsCard.style.transition = 'border-color 1.2s ease';
  }, 800);
}

function setResult(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('updated');
  // Force reflow for animation replay
  void el.offsetWidth;
  el.classList.add('updated');
}

function fmt(amount) {
  return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showError(msg) {
  // Simple non-blocking error — highlight the button
  const btn = document.getElementById('calcBtn');
  const origText = btn.textContent;
  btn.textContent = msg;
  btn.style.background = 'var(--red)';
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.background = '';
  }, 2000);
}

// ── FAQ Accordion ──
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

  // Open clicked (if it was closed)
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}
