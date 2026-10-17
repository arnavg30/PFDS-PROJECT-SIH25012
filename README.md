# EduAttend - Smart Attendance Management System for Rural Schools
**SIH Problem Statement ID:** SIH25012  
**Platform Architecture:** Modern, Responsive Web Platform (HTML5, CSS3, JavaScript, Bootstrap 5.3, Django-Ready Templates)

---

## 📌 Project Overview
**EduAttend** is an automated attendance management platform designed specifically for the realities of rural schools in India. It addresses the challenges of erratic network connectivity, minimal IT hardware, varied smartphone adoption, and high clerical workload on educators.

### Key Pillars:
1. **Three Flexible Attendance Modalities (NO RFID):**
   - **Face Recognition:** Identifies students from single or multiple classroom photographs in seconds.
   - **QR Code Attendance:** Rotating, dynamic QR codes with 2-minute timeouts and optional campus geo-fencing.
   - **Manual Attendance Fallback:** Simple, reliable one-tap roster for zero-connectivity situations.
2. **Four Dedicated User Roles:**
   - **Admin (Headmaster/Principal):** School-wide governance, rosters, audit trails, and policy controls.
   - **Teacher:** Session creation, face photo processing, QR generation, multi-tier review, and non-editable lockdowns.
   - **Student:** Mobile-friendly dashboard, rear camera QR scanner, individual attendance histories.
   - **Parent:** Multi-child monitoring, daily arrival SMS broadcasts, and monthly attendance tracking.
3. **Enterprise Non-Repudiation & Auditability:**
   - Teachers cannot alter records once locked.
   - Administrators must provide mandatory justification logs before making corrections.
   - Zero paid APIs or subscription services.

---

## 📂 Project Structure

```
D:\PFDS PROJECT SIH25012\
│
├── index.html                           # Root auto-redirect to templates/landing.html
│
├── templates/
│   ├── base.html                        # Master Django-compatible layout template
│   ├── landing.html                     # Minimalist public landing page
│   ├── login.html                       # Login portal with entity selector above inputs & Sign Up button
│   ├── signup.html                      # Sign Up portal with dynamic forms for all 4 entities
│   ├── forgot_password.html             # Password recovery interface
│   │
│   ├── admin/
│   │   ├── dashboard.html               # Admin stats, trend charts, quick actions
│   │   ├── students.html                # Searchable student directory & enrollment modal
│   │   ├── teachers.html                # Teacher roster & class assignments
│   │   ├── parents.html                 # Guardian registry & SMS logs
│   │   ├── classes.html                 # Class sections & room allocations
│   │   ├── attendance.html              # Master records & audit correction modal
│   │   ├── reports.html                 # Analytics charts & CSV/Excel exports
│   │   ├── audit_logs.html              # Non-repudiation audit trail logs
│   │   └── settings.html                # Face thresholds, QR timers & geo-fence toggles
│   │
│   ├── teacher/
│   │   ├── dashboard.html               # Teacher overview & quick session actions
│   │   ├── classes.html                 # Assigned classes & enrollment
│   │   ├── take_attendance.html         # 3-Card attendance mode selector
│   │   ├── face_attendance.html         # Classroom photo upload, face detection preview
│   │   ├── qr_attendance.html           # 2-minute dynamic QR generator & live scan counters
│   │   ├── manual_attendance.html       # Offline roll-call fallback table
│   │   ├── review_attendance.html       # 3-bucket review (Present / Review / Absent) & lock
│   │   ├── history.html                 # Locked past attendance sessions
│   │   └── reports.html                 # Class-level attendance curves & alerts
│   │
│   ├── student/
│   │   ├── dashboard.html               # Mobile-first student metrics & status
│   │   ├── scan_qr.html                 # Browser camera QR scanner & geo-check
│   │   ├── attendance_history.html      # Personal privacy-bounded logs
│   │   ├── statistics.html              # 75% examination eligibility charts
│   │   └── profile.html                 # Academic registration details
│   │
│   └── parent/
│       ├── dashboard.html               # Multi-child monitoring dashboard
│       ├── children.html                # Registered children overview
│       ├── attendance_history.html      # Child-specific searchable attendance logs
│       ├── statistics.html              # Term progress & donut breakdowns
│       ├── notifications.html           # Real-time arrival SMS broadcasts
│       └── profile.html                 # Guardian phone & ward links
│
└── static/
    ├── css/
    │   ├── style.css                    # Color system, buttons, badges, landing styles
    │   ├── dashboard.css                # Collapsible sidebar, topbar, cards, tables, camera box
    │   └── responsive.css               # Desktop, tablet, mobile breakpoints
    └── js/
        ├── main.js                      # Sidebar toggle, password toggle, table search, CSV export
        ├── attendance.js                # Face recognition simulation, review metrics & audit locks
        ├── qr_scanner.js                # QR countdown timer, camera stream & geo-location
        └── charts.js                    # Chart.js line, doughnut, and bar analytics
```

---

## 🚀 How to Run the Frontend Locally

### Option 1: Direct File Opening
Double-click `D:\PFDS PROJECT SIH25012\index.html` or open `D:\PFDS PROJECT SIH25012\templates\landing.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Option 2: Using Python HTTP Server (Recommended)
Open a terminal (PowerShell or Command Prompt) and run:
```bash
cd "D:\PFDS PROJECT SIH25012"
python -m http.server 8000
```
Then navigate to:
```
http://localhost:8000/
```

---

## 🔑 Demo Access & Interactive Preview
In `templates/login.html`, click any of the 4 demo role buttons to load pre-configured test credentials:
1. **Admin Portal:** `admin@school.gov.in` &rarr; Redirects to Admin Dashboard
2. **Teacher Portal:** `teacher.sunita@school.gov.in` &rarr; Redirects to Teacher Dashboard
3. **Student Portal:** `student.aarav@school.gov.in` &rarr; Redirects to Student Dashboard
4. **Parent Portal:** `parent.sharma@school.gov.in` &rarr; Redirects to Parent Dashboard

*(Alternatively, use the convenient "Preview Role" dropdown in the top navigation bar of every dashboard to switch between perspectives).*

---

## 🐍 Future Django Backend Integration Plan
1. **Templates Integration:** Replace relative links `../../static/` with Django `{% static 'path' %}` and `{% url 'route' %}`.
2. **Forms & CSRF:** Include `{% csrf_token %}` inside `<form>` tags.
3. **Authentication:** Bind `django.contrib.auth` with custom user model with `role` choices (`ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
4. **Computer Vision Backend:** Integrate OpenCV / InsightFace in Python for computing Euclidean face embeddings from uploaded classroom photos.
