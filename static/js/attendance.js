/**
 * EduAttend - Attendance Workflows Script
 * Handles Face Recognition simulation, Manual Attendance fallback,
 * Review & Final Submission locks, and Reason modals for admin corrections.
 */

// Simulated Face Recognition State
let faceRecognitionState = {
  photoCaptured: false,
  isProcessing: false,
  results: [
    { id: 'STU-101', name: 'Aarav Sharma', roll: '01', status: 'Recognized', confidence: '96%', finalStatus: 'Present', bbox: { top: 20, left: 15, w: 22, h: 32 } },
    { id: 'STU-102', name: 'Ananya Patel', roll: '02', status: 'Recognized', confidence: '92%', finalStatus: 'Present', bbox: { top: 22, left: 42, w: 20, h: 30 } },
    { id: 'STU-103', name: 'Rohan Verma', roll: '03', status: 'Needs Review', confidence: '61%', finalStatus: 'Needs Review', bbox: { top: 25, left: 68, w: 22, h: 33 } },
    { id: 'STU-104', name: 'Priya Kumari', roll: '04', status: 'Recognized', confidence: '89%', finalStatus: 'Present', bbox: { top: 58, left: 18, w: 20, h: 30 } },
    { id: 'STU-105', name: 'Kabir Das', roll: '05', status: 'Not Identified', confidence: '34%', finalStatus: 'Absent', bbox: null },
    { id: 'STU-106', name: 'Sneha Gupta', roll: '06', status: 'Recognized', confidence: '94%', finalStatus: 'Present', bbox: { top: 55, left: 50, w: 21, h: 31 } },
    { id: 'STU-107', name: 'Vikram Singh', roll: '07', status: 'Needs Review', confidence: '58%', finalStatus: 'Needs Review', bbox: { top: 54, left: 74, w: 20, h: 32 } },
    { id: 'STU-108', name: 'Isha Nair', roll: '08', status: 'Not Identified', confidence: '0%', finalStatus: 'Absent', bbox: null }
  ]
};

// Trigger Photo Upload & Preview
function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewImg = document.getElementById('cameraPreviewImg');
      const placeholder = document.getElementById('cameraPlaceholder');
      const processBtn = document.getElementById('btnProcessImage');
      
      if (previewImg) {
        previewImg.src = e.target.result;
        previewImg.classList.remove('d-none');
      }
      if (placeholder) placeholder.classList.add('d-none');
      if (processBtn) processBtn.disabled = false;
      
      faceRecognitionState.photoCaptured = true;
      showToast('Image Loaded', 'Classroom photo loaded successfully. Click "Process Image" to detect students.', 'info');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Simulated Face Recognition Processing
function processFaceRecognition() {
  const processBtn = document.getElementById('btnProcessImage');
  const progressBox = document.getElementById('processingStatusBox');
  const progressBar = document.getElementById('processingProgressBar');
  const statusText = document.getElementById('processingStatusText');
  const resultsCard = document.getElementById('recognitionResultsCard');
  const boundingBoxesContainer = document.getElementById('faceOverlayContainer');

  if (processBtn) processBtn.disabled = true;
  if (progressBox) progressBox.classList.remove('d-none');

  let progress = 10;
  const interval = setInterval(() => {
    progress += 20;
    if (progressBar) progressBar.style.width = progress + '%';

    if (progress === 30 && statusText) statusText.innerText = 'Detecting faces in classroom photo...';
    if (progress === 70 && statusText) statusText.innerText = 'Extracting feature embeddings & matching database...';
    
    if (progress >= 100) {
      clearInterval(interval);
      if (statusText) statusText.innerText = 'Processing Complete: 6 Detected, 2 Awaiting Verification';
      if (resultsCard) resultsCard.classList.remove('d-none');

      // Draw bounding boxes on photo
      if (boundingBoxesContainer) {
        boundingBoxesContainer.innerHTML = '';
        faceRecognitionState.results.forEach(stu => {
          if (stu.bbox) {
            const box = document.createElement('div');
            const isReview = stu.status === 'Needs Review';
            box.className = `face-bounding-box ${isReview ? 'needs-review' : ''}`;
            box.style.top = stu.bbox.top + '%';
            box.style.left = stu.bbox.left + '%';
            box.style.width = stu.bbox.w + '%';
            box.style.height = stu.bbox.h + '%';
            box.innerHTML = `<span class="face-tag ${isReview ? 'needs-review' : ''}">${stu.name} (${stu.confidence})</span>`;
            boundingBoxesContainer.appendChild(box);
          }
        });
      }

      showToast('Recognition Finished', 'Facial recognition simulation completed. Please review uncertain records before submission.', 'success');
    }
  }, 350);
}

// Attendance Row Toggle (Present / Review / Absent)
function toggleStudentStatus(rowId, newStatus) {
  const row = document.getElementById(rowId);
  if (!row) return;

  const badge = row.querySelector('.status-indicator');
  const remarksInput = row.querySelector('.row-remarks');

  row.setAttribute('data-row-status', newStatus.toLowerCase().replace(' ', '-'));
  if (badge) {
    if (newStatus === 'Present') {
      badge.className = 'badge-status badge-present status-indicator';
      badge.innerHTML = '<i class="bi bi-check-circle-fill"></i> Present';
    } else if (newStatus === 'Needs Review') {
      badge.className = 'badge-status badge-review status-indicator';
      badge.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Needs Review';
    } else if (newStatus === 'Absent') {
      badge.className = 'badge-status badge-absent status-indicator';
      badge.innerHTML = '<i class="bi bi-x-circle-fill"></i> Absent';
    }
  }

  updateReviewSummaryMetrics();
}

// Update Review Counter Metrics
function updateReviewSummaryMetrics() {
  const rows = document.querySelectorAll('#attendanceReviewTable tbody tr');
  let presentCount = 0;
  let reviewCount = 0;
  let absentCount = 0;

  rows.forEach(r => {
    const status = r.getAttribute('data-row-status');
    if (status === 'present') presentCount++;
    else if (status === 'needs-review' || status === 'review') reviewCount++;
    else if (status === 'absent') absentCount++;
  });

  const pEl = document.getElementById('countPresent');
  const rEl = document.getElementById('countReview');
  const aEl = document.getElementById('countAbsent');

  if (pEl) pEl.innerText = presentCount;
  if (rEl) rEl.innerText = reviewCount;
  if (aEl) aEl.innerText = absentCount;
}

// Final Attendance Submission Confirmation
function confirmFinalSubmission(className = 'Class 8A') {
  const pendingReviewCount = parseInt(document.getElementById('countReview')?.innerText || '0', 10);
  let warnMsg = '';
  if (pendingReviewCount > 0) {
    warnMsg = `<div class="alert alert-warning py-2 mb-3"><i class="bi bi-exclamation-triangle me-2"></i>There are <strong>${pendingReviewCount} student(s)</strong> marked as "Needs Review". If submitted, confirm their actual attendance status.</div>`;
  }

  const modalBody = document.getElementById('submitConfirmModalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      ${warnMsg}
      <p class="mb-2">Are you sure you want to finalize and submit attendance for <strong>${className}</strong>?</p>
      <p class="text-muted small mb-0"><i class="bi bi-shield-lock me-1"></i>Note: Once submitted, records are permanently locked for teachers. Any subsequent corrections require administrative audit review.</p>
    `;
  }

  const modal = new bootstrap.Modal(document.getElementById('submitConfirmationModal'));
  modal.show();
}

// Execute Final Submission Lock
function executeFinalSubmission() {
  const modalEl = document.getElementById('submitConfirmationModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  // Disable all editing controls
  const buttons = document.querySelectorAll('#attendanceReviewTable button, #btnSubmitAttendance, #btnSaveDraft');
  buttons.forEach(b => b.disabled = true);

  const lockBanner = document.getElementById('submissionLockedBanner');
  if (lockBanner) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();
    lockBanner.classList.remove('d-none');
    document.getElementById('submissionTimestampText').innerText = `Submitted & Locked on ${timeStr}`;
  }

  showToast('Attendance Finalized', 'Session attendance has been submitted and locked successfully. Syncing notifications to parents.', 'success');
}

// Admin Record Correction Modal with Mandatory Reason Audit
function openAdminCorrectionModal(recordId, studentName, currentStatus) {
  document.getElementById('modalCorrectionRecordId').value = recordId;
  document.getElementById('modalCorrectionStudentName').innerText = studentName;
  document.getElementById('modalCorrectionCurrentStatus').innerText = currentStatus;
  document.getElementById('modalCorrectionNewStatus').value = currentStatus === 'Present' ? 'Absent' : 'Present';
  document.getElementById('modalCorrectionReason').value = '';

  const modal = new bootstrap.Modal(document.getElementById('adminCorrectionModal'));
  modal.show();
}

// Save Admin Correction
function saveAdminCorrection() {
  const reason = document.getElementById('modalCorrectionReason').value.trim();
  if (!reason || reason.length < 5) {
    alert('Please enter a valid justification reason for the audit log (minimum 5 characters).');
    return;
  }

  const recordId = document.getElementById('modalCorrectionRecordId').value;
  const newStatus = document.getElementById('modalCorrectionNewStatus').value;
  
  // Update row in table
  const row = document.getElementById(`record-row-${recordId}`);
  if (row) {
    const badge = row.querySelector('.status-indicator');
    if (badge) {
      if (newStatus === 'Present') {
        badge.className = 'badge-status badge-present status-indicator';
        badge.innerHTML = '<i class="bi bi-check-circle-fill"></i> Present';
      } else {
        badge.className = 'badge-status badge-absent status-indicator';
        badge.innerHTML = '<i class="bi bi-x-circle-fill"></i> Absent';
      }
    }
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('adminCorrectionModal'));
  if (modal) modal.hide();

  showToast('Correction Logged', `Record ${recordId} changed to ${newStatus}. Audit trail updated with reason: "${reason}".`, 'warning');
}
