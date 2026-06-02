#  SAMS — Student Academic Management System

A full-stack, production-ready academic management platform built with **Next.js 14**, **MySQL** , and **NextAuth.js**.



## ✨ Features

| Feature | Description |
|---|---|
| Role-Based Auth | Admin, Faculty, Student — different dashboards and access |
| Students | Full CRUD with search, pagination, photo profile |
| Faculty | Manage faculty, department assignments |
| Courses | Course catalog with faculty/dept JOINs |
| Enrollment | Enroll students in courses |
| Grades | Inline editable — MySQL trigger auto-assigns grade & GPA |
| Attendance | Bulk mark (Present/Absent/Late) per course per date |
| Timetable | Mon–Fri weekly grid, color-coded by dept |
| Announcements | Role-targeted notices |
| Reports | Full academic report PDF print via stored procedure |
| Audit Log | Auto-logged on grade/attendance changes |



## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | MySQL 8+ (Railway cloud — zero install) |
| ORM/Query | `mysql2` raw queries (no ORM, for DBMS clarity) |
| Auth | NextAuth.js (JWT, CredentialsProvider) |
| Data Fetching | SWR (auto-refresh) |
| Charts | Recharts |
| Hosting | Vercel (serverless) |
| DB Hosting | Railway (free MySQL cloud) |



##  Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/sams.git
cd sams
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Railway MySQL (no local install needed!)
1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. Click **New Project → Provision MySQL**
3. Click on the MySQL service → **Connect** tab
4. Copy the **Public URL** connection details

### 4. Configure `.env.local`
```env
DB_HOST=your-public-host.railway.app
DB_PORT=your-port
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=student_ams

NEXTAUTH_SECRET=any-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
```

### 5. Run the database schema
Copy the contents of `database/schema.sql` and run it in your Railway MySQL console:
- Railway dashboard → MySQL → **Query** tab → paste and run `schema.sql`

### 6. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Demo login:** `admin@sams.edu` / `Admin@123`

---

## 🌐 Vercel Deployment

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** from GitHub
3. In Vercel → **Project Settings → Environment Variables**, add all 6 `.env.local` vars
4. Change `NEXTAUTH_URL` to your Vercel URL (e.g. `https://sams.vercel.app`)
5. **Deploy** — all API routes auto-deploy as serverless functions



## 🗄️ Database Schema

11 tables with foreign keys, indexes, and constraints:
- `users`, `students`, `faculty`, `departments`, `courses`
- `enrollments`, `grades`, `attendance`, `timetable`, `announcements`, `audit_log`

MySQL features used:
- **JOINs** — every API route uses multi-table JOINs
- **GROUP BY + aggregate functions** — attendance %, dept counts
- **Subqueries** — enrolled_count in courses list
- **Stored Procedures** — `sp_calculate_gpa`, `sp_get_student_report`
- **Triggers** — auto grade assignment, audit logging
- **Views** — `v_student_dashboard`



## 📁 Project Structure

```
sams/
├── app/
│   ├── (dashboard)/        # Protected pages (layout with sidebar)
│   │   ├── dashboard/      # Role-aware dashboard
│   │   ├── students/       # List, detail, edit
│   │   ├── courses/        # Course management
│   │   ├── enrollment/     # Enroll students
│   │   ├── grades/         # Inline grade entry
│   │   ├── attendance/     # Bulk attendance marking
│   │   ├── timetable/      # Weekly grid
│   │   ├── announcements/  # Campus notices
│   │   ├── faculty/        # Faculty management
│   │   ├── departments/    # Department cards
│   │   └── reports/        # Full academic report + PDF
│   ├── api/                # Serverless API routes
│   └── login/              # Auth page
├── components/             # Reusable UI components
├── lib/                    # db.ts, auth.ts, utils.ts
└── database/
    └── schema.sql          # Complete MySQL schema
```



## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@sams.edu | Admin@123 |

Create Faculty and Student accounts through the admin dashboard




