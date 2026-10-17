/**
 * EduAttend - Main Interactive Script
 * Sidebar toggle, Toast notifications, Modals, Show/Hide Password,
 * Table Searching, Table Filtering, and Mock Data Exports
 */

// Initialize Theme Mode (Dark/Light) immediately on load to prevent flash
(function() {
  const savedTheme = localStorage.getItem('eduattend_theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initPasswordToggles();
  initSearchableTables();
  initStatusFilters();
  initDemoRoleSwitchers();
});

// Sidebar Collapse & Mobile Drawer
function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        if (sidebar) sidebar.classList.toggle('show-mobile');
        if (backdrop) backdrop.classList.toggle('show');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('show-mobile');
      backdrop.classList.remove('show');
    });
  }
}

// Show/Hide Password Eye Toggle
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.toggle-password-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
          }
        }
      }
    });
  });
}

// Toast Notifications Helper
function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
  }

  const toastId = 'toast_' + Date.now();
  const bgHeader = type === 'success' ? 'text-success' : type === 'danger' ? 'text-danger' : type === 'warning' ? 'text-warning' : 'text-primary';
  const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : type === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';

  const toastHtml = `
    <div id="${toastId}" class="toast bg-white shadow-lg border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header border-bottom-0 pb-1">
        <i class="bi ${icon} ${bgHeader} me-2 fs-5"></i>
        <strong class="me-auto text-dark">${title}</strong>
        <small class="text-muted">Just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body pt-1 text-secondary">
        ${message}
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', toastHtml);
  const toastEl = document.getElementById(toastId);
  if (window.bootstrap && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
    bsToast.show();
  } else {
    toastEl.style.display = 'block';
    setTimeout(() => toastEl.remove(), 4500);
  }
}

// Dynamic Client-side Searchable Tables
function initSearchableTables() {
  const searchInputs = document.querySelectorAll('[data-table-search]');
  searchInputs.forEach(input => {
    const tableId = input.getAttribute('data-table-search');
    const table = document.getElementById(tableId);
    if (!table) return;

    input.addEventListener('keyup', () => {
      const query = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });
}

// Attendance Status Filters (All, Present, Needs Review, Absent)
function initStatusFilters() {
  const filterButtons = document.querySelectorAll('[data-status-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTableId = btn.getAttribute('data-target-table');
      const statusValue = btn.getAttribute('data-status-filter');
      const table = document.getElementById(targetTableId);
      if (!table) return;

      // Update active button state
      btn.parentElement.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active', 'btn-primary'));
      btn.classList.add('active', 'btn-primary');

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const rowStatus = row.getAttribute('data-row-status');
        if (statusValue === 'all' || rowStatus === statusValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

// Quick Demo Role Switcher
function initDemoRoleSwitchers() {
  const roleSelect = document.getElementById('demoRoleSelector');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'admin') window.location.href = '../admin/dashboard.html';
      else if (selected === 'teacher') window.location.href = '../teacher/dashboard.html';
      else if (selected === 'student') window.location.href = '../student/dashboard.html';
      else if (selected === 'parent') window.location.href = '../parent/dashboard.html';
    });
  }
}

// Export CSV Helper Function
function exportTableToCSV(tableId, filename = 'attendance_report.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    if (row.style.display === 'none') return; // skip filtered
    let cols = [];
    row.querySelectorAll('th, td').forEach((col, idx) => {
      // Ignore actions column (usually last)
      if (col.querySelector('button') && idx === row.children.length - 1) return;
      let data = col.innerText.replace(/"/g, '""').trim();
      cols.push(`"${data}"`);
    });
    if (cols.length) csv.push(cols.join(','));
  });

  const csvBlob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(csvBlob);
  downloadLink.setAttribute('download', filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  showToast('Export Success', `Exported data successfully to ${filename}`, 'success');
}


// Theme Mode (Dark/Light) Management
function initTheme() {
  const currentTheme = localStorage.getItem('eduattend_theme') || 'light';
  applyTheme(currentTheme);

  // Bind all theme toggle buttons on the page
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('eduattend_theme', newTheme);
  showToast('Theme Changed', `Switched to ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'info');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  
  // Update icons on any theme toggle buttons
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      btn.setAttribute('title', 'Switch to Light Mode');
    } else {
      btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      btn.setAttribute('title', 'Switch to Dark Mode');
    }
  });
}
