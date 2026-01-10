# Blank Resume Initialization

## Overview
Updated the `/builder` page to load a blank resume instead of trying to load a specific resume ID. This allows users to start creating a new resume from scratch.

## Changes Made

### 1. **Resume Store** (`lib/stores/resume-store.ts`)

#### Added `initializeBlankResume` Method
```typescript
initializeBlankResume: () => {
    const blankResume: Resume = {
        id: 'new',
        title: 'Untitled Resume',
        personal: {
            name: '',
            title: '',
            email: '',
            phone: '',
            location: '',
        },
        social: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: '',
            pinterest: '',
            website: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        templateId: 'modern',
        colorId: 'indigo',
        ats_score: null,
        data: {},
        etag: null,
        lastSavedAt: null,
    };

    set({
        currentResume: blankResume,
        isDirty: false,
        isSaving: false,
        lastSaved: null,
        etag: null,
        saveError: null,
    });
}
```

#### Updated `saveResume` Method
Added logic to create a new resume when ID is 'new':
```typescript
// If ID is 'new', create a new resume, otherwise update existing
if (currentResume.id === 'new') {
    response = await resumeAPI.create(payload);
} else {
    response = await resumeAPI.update(currentResume.id, payload, {
        headers: {
            'If-Match': etag || '',
        }
    });
}
```

### 2. **Builder Page** (`app/(dashboard)/builder/page.tsx`)

#### Before:
```typescript
const resumeId = '1';
const { loadResume, currentResume } = useResumeStore();

useEffect(() => {
    loadResume(resumeId);
}, [resumeId, loadResume]);
```

#### After:
```typescript
const { initializeBlankResume, currentResume } = useResumeStore();

useEffect(() => {
    // Initialize a blank resume when the page loads
    initializeBlankResume();
}, [initializeBlankResume]);
```

## User Flow

### Creating a New Resume

1. **User visits** `/builder`
2. **Blank resume initialized** with:
   - Empty personal information fields
   - Empty social media links
   - No experience entries
   - No education entries
   - No skills
   - Default template: 'modern'
   - Default color: 'indigo'
   - Resume ID: 'new'

3. **User fills in information**:
   - Personal details
   - Work experience
   - Education
   - Skills
   - Summary

4. **User exports PDF** or manually saves:
   - System checks if ID is 'new'
   - Creates new resume via `POST /api/resumes`
   - Backend assigns real ID
   - Resume saved to database
   - Store updates with new ID and ETag

5. **Resume appears** in `/my-resume` page

### Editing an Existing Resume

1. **User clicks "Edit"** on resume card in `/my-resume`
2. **Navigates to** `/builder?id={resumeId}`
3. **Existing resume loaded** via `loadResume(id)`
4. **User makes changes**
5. **Auto-save or manual save**:
   - System checks ID is not 'new'
   - Updates existing resume via `PUT /api/resumes/{id}`
   - ETag conflict detection applied

## Benefits

1. **Clean Start**: Users get a fresh, empty resume template
2. **No Errors**: No more 404 errors from trying to load non-existent resume ID
3. **Intuitive**: Matches user expectation when clicking "New Resume"
4. **Flexible**: Can still load existing resumes via query parameter
5. **Auto-Save Ready**: First save creates the resume, subsequent saves update it

## Default Values

| Field | Default Value |
|-------|--------------|
| ID | 'new' |
| Title | 'Untitled Resume' |
| Template | 'modern' |
| Color | 'indigo' |
| Personal Info | Empty strings |
| Social Links | Empty strings |
| Summary | Empty string |
| Experience | Empty array |
| Education | Empty array |
| Skills | Empty array |
| ATS Score | null |

## API Behavior

### Creating New Resume
```
POST /api/resumes
{
  "title": "Untitled Resume",
  "data": { ... },
  "template_id": "modern",
  "color_id": "indigo",
  "ats_score": null
}

Response: 201 Created
{
  "id": 3,
  "user_id": 2,
  "title": "Untitled Resume",
  ...
}
```

### Updating Existing Resume
```
PUT /api/resumes/3
Headers: { "If-Match": "etag-value" }
{
  "title": "Software Engineer Resume",
  "data": { ... },
  ...
}

Response: 200 OK
{
  "id": 3,
  "title": "Software Engineer Resume",
  ...
}
```

## Future Enhancements

1. **Resume Templates**: Allow users to start from pre-filled templates
2. **Import from LinkedIn**: Auto-fill resume from LinkedIn profile
3. **Duplicate Resume**: Create new resume from existing one
4. **Resume Wizard**: Step-by-step guided resume creation
5. **Save Draft**: Auto-save drafts without requiring full resume
6. **Multiple Blank Resumes**: Allow creating multiple new resumes simultaneously

## Testing Checklist

- [x] Blank resume loads on `/builder`
- [x] All fields are empty
- [x] Default template and color applied
- [x] User can fill in information
- [x] First save creates new resume
- [x] Subsequent saves update the resume
- [x] Resume appears in `/my-resume` after save
- [x] No 404 errors
- [x] Auto-save works correctly
- [x] Export PDF works with blank resume
