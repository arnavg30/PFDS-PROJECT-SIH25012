/**
 * EduAttend - Chart.js Visualizations Script
 * Attendance trends, Present vs Absent donuts, and monthly rate charts
 */

function initAttendanceTrendChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Class 8A (%)',
          data: [92, 95, 88, 94, 91, 96],
          borderColor: '#1E56A0',
          backgroundColor: 'rgba(30, 86, 160, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#1E56A0',
          pointRadius: 4
        },
        {
          label: 'Class 9B (%)',
          data: [85, 88, 86, 89, 87, 90],
          borderColor: '#16697A',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: '#16697A',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } },
        tooltip: {
          backgroundColor: '#0F2942',
          titleFont: { family: 'Inter', size: 13 },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        y: {
          min: 70,
          max: 100,
          ticks: { stepSize: 5, callback: val => val + '%' },
          grid: { color: '#E2E8F0' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function initAttendanceDonutChart(canvasId, present = 88, review = 5, absent = 7) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Needs Review', 'Absent'],
      datasets: [{
        data: [present, review, absent],
        backgroundColor: ['#198754', '#FD7E14', '#DC3545'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15, font: { family: 'Inter', size: 12 } } }
      }
    }
  });
}

function initMonthlyTrendBarChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Attendance %',
          data: [91, 89, 93, 88, 92, 94],
          backgroundColor: '#1E56A0',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 60,
          max: 100,
          ticks: { callback: v => v + '%' },
          grid: { color: '#E2E8F0' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}
