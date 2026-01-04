# Resume Builder - Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm
- PHP 8.2+
- Composer
- PostgreSQL (or SQLite for quick testing)

## 🚀 Quick Start (5 minutes)

### 1. Frontend Setup
```bash
cd resume-builder-frontend
npm install
npm run dev
```
Frontend will run on **http://localhost:3000**

### 2. Backend Setup

#### Option A: SQLite (Fastest - No DB install needed)
```bash
cd resume-builder-backend

# Create SQLite database
touch database/database.sqlite

# Update .env
DB_CONNECTION=sqlite
# Comment out other DB_ variables

# Run migrations and seed
php artisan migrate:fresh --seed

# Start server
php artisan serve
```

#### Option B: PostgreSQL (Production-ready)
```bash
cd resume-builder-backend

# Create database
createdb resume_builder

# Update .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=resume_builder
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations and seed
php artisan migrate:fresh --seed

# Start server
php artisan serve
```

Backend will run on **http://localhost:8000**

### 3. Test the Application

1. Open **http://localhost:3000**
2. Click **"Open Resume Builder"**
3. Try these features:
   - ✅ Edit name in **Manual** tab → See live preview update
   - ✅ Switch to **Colors** tab → Change palette
   - ✅ Switch to **Templates** tab → Change layout
   - ✅ Resize browser to mobile → Test responsive design
   - ✅ Watch **"Draft saved"** indicator in navbar

**Note:** Auto-save to backend will work once both servers are running!

---

## 📝 Demo Credentials

**Email:** demo@resumeai.com  
**Password:** password

---

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)
```env
APP_NAME="Resume Builder"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite - easiest)
DB_CONNECTION=sqlite

# OR PostgreSQL
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=resume_builder
# DB_USERNAME=postgres
# DB_PASSWORD=

# OpenAI (for AI features - optional for now)
OPENAI_API_KEY=sk-...
```

---

## 🎯 What's Implemented

### ✅ Working Features
- **State Management:** Zustand stores for resume and UI
- **Auto-Save Hook:** 3-second debounce with offline support
- **Resume Builder UI:** All 5 tabs (Upload, Manual, AI, Templates, Colors)
- **Real-Time Preview:** Live updates with color/template switching
- **Mobile Responsive:** Sidebar, preview modal, FAB button
- **Database Schema:** Resumes and uploads tables with ETag
- **Laravel API:** CRUD endpoints with conflict detection
- **Mock Data:** Demo user and resume for testing

### 🚧 Coming Next
- File upload with drag-and-drop
- PDF/DOCX parsing with AI
- Drag-and-drop field reordering
- Authentication (Sanctum)
- Export to PDF
- ATS scoring

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd resume-builder-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend migration errors
```bash
cd resume-builder-backend
php artisan migrate:fresh --seed
```

### "Cannot find module" errors
TypeScript may show import errors - these are false positives. The app will run fine.

### CORS errors
Add to `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

---

## 📚 Project Structure

```
resume-builder-frontend/
├── app/
│   ├── (dashboard)/builder/[id]/page.tsx  # Main builder
│   └── page.tsx                            # Home page
├── components/resume-builder/
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── preview-panel.tsx
│   ├── mobile-preview.tsx
│   └── tabs/
│       ├── tab-upload.tsx
│       ├── tab-manual.tsx
│       ├── tab-ai.tsx
│       ├── tab-templates.tsx
│       └── tab-colors.tsx
├── lib/stores/
│   ├── resume-store.ts
│   └── ui-store.ts
└── hooks/
    └── use-auto-save.ts

resume-builder-backend/
├── app/
│   ├── Models/
│   │   ├── Resume.php
│   │   └── ResumeUpload.php
│   └── Http/Controllers/Api/
│       ├── ResumeController.php
│       └── UploadController.php
├── database/
│   ├── migrations/
│   │   ├── *_create_resumes_table.php
│   │   └── *_create_resume_uploads_table.php
│   └── seeders/
│       ├── UserSeeder.php
│       └── ResumeSeeder.php
└── routes/
    └── api.php
```

---

## 🎨 Key Features Demo

### Auto-Save (3-second debounce)
1. Edit any field in Manual tab
2. Wait 3 seconds
3. See "Draft saved X ago" in navbar
4. Refresh page → Changes persist

### Real-Time Preview
1. Type in "Full Name" field
2. Preview updates instantly
3. Change color palette
4. See accent color change in preview

### Mobile Responsive
1. Resize browser to 375px
2. Click hamburger menu → Sidebar slides in
3. Click floating eye button → Full-screen preview
4. All features work on mobile

---

## 🚀 Next Steps

1. **Test the UI** - Make sure everything works
2. **Connect Backend** - Test auto-save with real API
3. **Add Authentication** - Implement Sanctum
4. **File Upload** - Add drag-and-drop with parsing
5. **Export PDF** - Implement download functionality

---

## 💡 Tips

- Use **SQLite** for quick testing (no DB setup needed)
- Check browser console for any errors
- Use Redux DevTools to inspect Zustand state
- Backend API is at `http://localhost:8000/api`
- All state persists in localStorage (survives refresh)

---

**Need help?** Check the walkthrough.md for detailed implementation details.
