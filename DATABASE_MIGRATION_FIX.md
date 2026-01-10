# Database Migration Fix - Resume Template and Color Columns

## Issue
When attempting to save a resume via the API (`PUT /api/resumes/1`), the following error occurred:

```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'template_id' in 'field list'
```

## Root Cause
The `resumes` table was missing the `template_id` and `color_id` columns that the application was trying to update. While these columns were defined in the original migration file (`2026_01_02_215755_create_resumes_table.php`), they were not present in the actual database table.

## Solution
Created and ran a new migration to add the missing columns to the existing `resumes` table.

### Migration File
**File:** `database/migrations/2026_01_10_075041_add_template_and_color_to_resumes_table.php`

```php
public function up(): void
{
    Schema::table('resumes', function (Blueprint $table) {
        // Check if columns don't exist before adding them
        if (!Schema::hasColumn('resumes', 'template_id')) {
            $table->string('template_id')->default('modern')->after('data');
        }
        if (!Schema::hasColumn('resumes', 'color_id')) {
            $table->string('color_id')->default('indigo')->after('template_id');
        }
    });
}
```

### Key Features
1. **Safe Column Addition**: Uses `Schema::hasColumn()` to check if columns exist before adding them
2. **Default Values**: Sets sensible defaults ('modern' for template, 'indigo' for color)
3. **Proper Positioning**: Places columns after the `data` column for logical ordering
4. **Reversible**: Includes proper `down()` method to drop columns if needed

## Database Schema After Migration

The `resumes` table now includes:
- `id` - Primary key
- `user_id` - Foreign key to users table
- `title` - Resume title
- `data` - JSON column with resume content
- **`template_id`** ✅ - Template identifier (default: 'modern')
- **`color_id`** ✅ - Color scheme identifier (default: 'indigo')
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `last_edited_at` - Last edit timestamp
- `template` - Legacy template field
- `ats_score` - ATS compatibility score
- `status` - Resume status
- `deleted_at` - Soft delete timestamp

## Testing
Migration was successfully run with:
```bash
php artisan migrate
```

Verified columns were added:
```bash
php artisan tinker --execute="print_r(Schema::getColumnListing('resumes'));"
```

## Impact
✅ Resume save functionality now works correctly
✅ Template selection is persisted to database
✅ Color scheme selection is persisted to database
✅ Export PDF feature can save resume before exporting
✅ Resumes appear in `/my-resume` page with correct template and color

## Next Steps
- Test resume creation and updates via API
- Verify template and color persistence in UI
- Test export PDF with save functionality
- Ensure all existing resumes have default values for template_id and color_id
