/**
 * EduAttend - QR Code Generator & Scanner Script
 * Handles Dynamic QR generation with expiry countdown, simulated responses,
 * Camera scanner permission handling, fallback simulation, and optional geo-location check.
 */

let qrTimer = null;
let qrSecondsLeft = 120; // 2 minutes expiry
let qrTotalStudents = 35;
let qrVerifiedCount = 14;

// Generate or Regenerate QR code
function startQRSession() {
  clearInterval(qrTimer);
  qrSecondsLeft = 120;
  
  const countdownEl = document.getElementById('qrCountdownText');
  const verifiedEl = document.getElementById('qrVerifiedCount');
  const pendingEl = document.getElementById('qrPendingCount');
  const qrImageEl = document.getElementById('qrGeneratedImage');

  // Change QR image to simulate fresh token
  if (qrImageEl) {
    const randomSeed = Math.floor(Math.random() * 10000);
    qrImageEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=EduAttend-SESSION-${randomSeed}-CLASS8A`;
  }

  qrVerifiedCount = 12;
  if (verifiedEl) verifiedEl.innerText = qrVerifiedCount;
  if (pendingEl) pendingEl.innerText = qrTotalStudents - qrVerifiedCount;

  qrTimer = setInterval(() => {
    qrSecondsLeft--;
    const mins = Math.floor(qrSecondsLeft / 60);
    const secs = qrSecondsLeft % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (countdownEl) countdownEl.innerText = formatted;

    // Simulate incoming student scans every few seconds
    if (qrSecondsLeft % 8 === 0 && qrVerifiedCount < qrTotalStudents) {
      qrVerifiedCount += 1;
      if (verifiedEl) verifiedEl.innerText = qrVerifiedCount;
      if (pendingEl) pendingEl.innerText = qrTotalStudents - qrVerifiedCount;
    }

    if (qrSecondsLeft <= 0) {
      clearInterval(qrTimer);
      if (countdownEl) {
        countdownEl.innerText = 'EXPIRED';
        countdownEl.classList.remove('text-primary');
        countdownEl.classList.add('text-danger');
      }
      showToast('QR Code Expired', 'The QR session code has expired. Click "Regenerate QR" to resume scanning.', 'warning');
    }
  }, 1000);

  showToast('Session Active', 'Temporary QR Attendance Code generated (2-min window).', 'success');
}

// Student QR Camera Scanner Handlers
let videoStream = null;

function requestCameraScan() {
  const video = document.getElementById('scannerVideo');
  const placeholder = document.getElementById('scannerPlaceholder');
  const statusEl = document.getElementById('scanResultStatus');
  const permError = document.getElementById('scannerPermError');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        videoStream = stream;
        if (video) {
          video.srcObject = stream;
          video.classList.remove('d-none');
        }
        if (placeholder) placeholder.classList.add('d-none');
        if (permError) permError.classList.add('d-none');

        // Simulate automatic scan recognition after 2.5 seconds
        setTimeout(() => {
          stopCameraStream();
          simulateSuccessfulScan();
        }, 2500);
      })
      .catch(err => {
        console.warn('Camera access denied or unsupported:', err);
        if (placeholder) placeholder.classList.add('d-none');
        if (permError) permError.classList.remove('d-none');
      });
  } else {
    if (placeholder) placeholder.classList.add('d-none');
    if (permError) permError.classList.remove('d-none');
  }
}

function stopCameraStream() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  const video = document.getElementById('scannerVideo');
  if (video) video.classList.add('d-none');
}

function simulateSuccessfulScan() {
  const resultCard = document.getElementById('scanSuccessCard');
  const timestampEl = document.getElementById('scanTimestamp');
  const locStatusEl = document.getElementById('scanLocationStatus');

  const now = new Date();
  if (timestampEl) timestampEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  
  // Optional geo-verification simulation check
  const geoToggle = document.getElementById('optInGeoLocation');
  if (geoToggle && geoToggle.checked) {
    if (locStatusEl) locStatusEl.innerHTML = '<span class="text-success"><i class="bi bi-geo-alt-fill"></i> Location Verified (Within Campus Boundary)</span>';
  } else {
    if (locStatusEl) locStatusEl.innerHTML = '<span class="text-muted"><i class="bi bi-geo-alt"></i> Location verification not requested by school</span>';
  }

  if (resultCard) resultCard.classList.remove('d-none');
  showToast('Attendance Recorded', 'QR Scan verified successfully. Marked Present for today.', 'success');
}
