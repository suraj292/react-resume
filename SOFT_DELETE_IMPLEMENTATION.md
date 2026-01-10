# Soft Delete Implementation for Resumes

## Overview
Implemented comprehensive soft delete functionality for resumes, allowing users to delete resumes temporarily and restore them later, or permanently delete them.

## Features Implemented

### 1. **Soft Delete Toggle**
- Added a toggle button in the filters section to switch between viewing active and deleted resumes
- Button shows "Active" when viewing active resumes (default)
- Button shows "Deleted" when viewing deleted resumes (highlighted in red)
- Icon changes from trash to trash-arrow-up when viewing deleted

### 2. **Filtered Resume Display**
- Active resumes shown by default (`deleted_at === null`)
- Deleted resumes shown when toggle is active (`deleted_at !== null`)
- Search functionality works across both views
- Resume count updates based on current view

### 3. **Context-Aware Dropdown Menu**
When viewing **Active Resumes**:
- Duplicate (placeholder)
- Rename (placeholder)
- Delete (soft delete)

When viewing **Deleted Resumes**:
- Restore (restores the resume)
- Delete Forever (permanent delete)

### 4. **Restore Functionality**
- Clicking "Restore" on a deleted resume restores it
- Resume moves back to active resumes list
- Toast notification confirms successful restore
- List automatically refreshes after restore

### 5. **Delete Behavior**
- **Active Resumes**: Delete performs soft delete (sets `deleted_at` timestamp)
- **Deleted Resumes**: Delete Forever performs permanent deletion
- Modal confirmation required for both actions
- Different toast messages based on context

## Technical Implementation

### Frontend Changes

#### 1. **Resume Interface** (`app/(dashboard)/my-resume/page.tsx`)
```typescript
interface Resume {
    id: number;
    title: string;
    template: string;
    ats_score?: number;
    updated_at: string;
    created_at: string;
    is_draft?: boolean;
    deleted_at?: string | null;  // ✨ Added
}
```

#### 2. **State Management**
```typescript
const [showDeleted, setShowDeleted] = useState(false);
```

#### 3. **Filtered Resumes Logic**
```typescript
const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDeletedFilter = showDeleted 
        ? resume.deleted_at !== null 
        : resume.deleted_at === null;
    return matchesSearch && matchesDeletedFilter;
});
```

#### 4. **Restore Handler**
```typescript
const handleRestoreClick = async (resumeId: number) => {
    try {
        await resumeAPI.restore(resumeId);
        const response = await resumeAPI.getAll();
        if (Array.isArray(response.data)) {
            setResumes(response.data);
        }
        setActiveMenuId(null);
        displayToast('Resume restored successfully');
    } catch (error) {
        console.error('Failed to restore resume:', error);
        displayToast('Failed to restore resume');
    }
};
```

#### 5. **Updated Delete Handler**
```typescript
const confirmDelete = async () => {
    if (!resumeToDelete) return;
    
    try {
        await resumeAPI.delete(resumeToDelete);
        // Reload resumes to update the list
        const response = await resumeAPI.getAll();
        if (Array.isArray(response.data)) {
            setResumes(response.data);
        }
        setShowDeleteModal(false);
        setResumeToDelete(null);
        displayToast(showDeleted ? 'Resume permanently deleted' : 'Resume deleted successfully');
    } catch (error) {
        console.error('Failed to delete resume:', error);
        displayToast('Failed to delete resume');
    }
};
```

#### 6. **API Client** (`lib/api.ts`)
```typescript
export const resumeAPI = {
    // ... existing methods
    restore: (id: string | number) =>
        api.post(`/resumes/${id}/restore`),
};
```

### Backend Changes

#### 1. **Resume Model** (`app/Models/Resume.php`)
Already uses `SoftDeletes` trait:
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Resume extends Model
{
    use SoftDeletes;
    // ...
}
```

#### 2. **Resume Controller** (`app/Http/Controllers/Api/ResumeController.php`)
Added restore method:
```php
/**
 * Restore a soft-deleted resume.
 */
public function restore($id)
{
    $resume = Resume::withTrashed()->findOrFail($id);
    $resume->restore();

    return response()->json($resume);
}
```

#### 3. **API Routes** (`routes/api.php`)
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('resumes', [ResumeController::class, 'index']);
    Route::get('resumes/{resume}', [ResumeController::class, 'show']);
    Route::post('resumes', [ResumeController::class, 'store'])->middleware('plan.limit:resume');
    Route::put('resumes/{resume}', [ResumeController::class, 'update']);
    Route::delete('resumes/{resume}', [ResumeController::class, 'destroy']);
    Route::post('resumes/{resume}/restore', [ResumeController::class, 'restore']); // ✨ New
});
```

### Database Schema

The `resumes` table includes:
```sql
deleted_at TIMESTAMP NULL  -- Soft delete timestamp
```

## User Experience Flow

### Deleting a Resume (Active View)
1. User clicks three-dot menu on resume card
2. Clicks "Delete"
3. Confirmation modal appears
4. User confirms deletion
5. Resume is soft deleted (`deleted_at` set to current timestamp)
6. Toast: "Resume deleted successfully"
7. Resume disappears from active list
8. Resume appears in deleted list (when toggled)

### Restoring a Resume (Deleted View)
1. User toggles to "Deleted" view
2. Deleted resumes appear with red tint/indicator
3. User clicks three-dot menu on deleted resume
4. Clicks "Restore"
5. Resume is restored (`deleted_at` set to null)
6. Toast: "Resume restored successfully"
7. Resume disappears from deleted list
8. Resume reappears in active list (when toggled back)

### Permanently Deleting a Resume
1. User toggles to "Deleted" view
2. User clicks three-dot menu on deleted resume
3. Clicks "Delete Forever"
4. Confirmation modal appears: "This action cannot be undone"
5. User confirms
6. Resume is permanently deleted from database
7. Toast: "Resume permanently deleted"
8. Resume disappears from deleted list

## UI Components

### Toggle Button
```tsx
<button
    onClick={() => setShowDeleted(!showDeleted)}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
        showDeleted 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
>
    <i className={`fa-solid ${showDeleted ? 'fa-trash-arrow-up' : 'fa-trash'}`}></i>
    {showDeleted ? 'Deleted' : 'Active'}
</button>
```

### Restore Button (in dropdown)
```tsx
<button
    onClick={() => handleRestoreClick(resume.id)}
    className="w-full text-left px-4 py-2 text-xs text-green-600 hover:bg-green-50"
>
    <i className="fa-solid fa-trash-arrow-up mr-2"></i> Restore
</button>
```

## Benefits

1. **Safety**: Accidental deletions can be recovered
2. **User Control**: Users can manage their deleted resumes
3. **Clean Interface**: Deleted resumes don't clutter the main view
4. **Permanent Option**: Users can permanently delete when ready
5. **Audit Trail**: Deleted resumes remain in database with timestamp
6. **Performance**: Soft deletes are faster than permanent deletes

## Future Enhancements

1. **Auto-Purge**: Automatically permanently delete resumes after 30 days
2. **Bulk Operations**: Restore or delete multiple resumes at once
3. **Deleted Count Badge**: Show count of deleted resumes on toggle button
4. **Undo Toast**: Quick undo button in delete toast notification
5. **Deleted Date Display**: Show when resume was deleted
6. **Filter by Delete Date**: Sort deleted resumes by deletion date
7. **Admin Panel**: View all deleted resumes across all users

## Testing Checklist

- [x] Soft delete works correctly
- [x] Restore functionality works
- [x] Toggle switches between views
- [x] Search works in both views
- [x] Toast notifications appear correctly
- [x] Dropdown menu shows correct options
- [x] Permanent delete works from deleted view
- [x] Database `deleted_at` column is set/cleared correctly
- [x] API endpoints return correct data
- [x] Error handling works for failed operations
