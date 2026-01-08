# Resume Template Management System

## Overview

This document describes the Filament-based template management system for managing resume templates in the AI Resume Builder application.

## Architecture

### Backend Components

1. **Database Table**: `resume_templates`
   - Location: `resume-builder-backend/database/migrations/2026_01_08_093556_create_resume_templates_table.php`
   - Fields:
     - `id`: Primary key
     - `template_id`: Unique identifier (e.g., 'modern', 'creative')
     - `name`: Display name
     - `category`: Template category
     - `description`: Detailed description
     - `preview_image`: Path to full preview image
     - `thumbnail_image`: Path to thumbnail
     - `supported_colors`: JSON array of supported color schemes
     - `features`: JSON array of template features
     - `is_active`: Boolean flag for active status
     - `is_premium`: Boolean flag for premium templates
     - `sort_order`: Integer for ordering templates
     - `best_for`: Industry/role recommendation
     - `complexity_level`: beginner, intermediate, or advanced

2. **Model**: `ResumeTemplate`
   - Location: `resume-builder-backend/app/Models/ResumeTemplate.php`
   - Scopes:
     - `active()`: Get only active templates
     - `free()`: Get only free templates
     - `premium()`: Get only premium templates
     - `ordered()`: Order by sort_order
   - Accessors:
     - `preview_image_url`: Full URL to preview image
     - `thumbnail_image_url`: Full URL to thumbnail

3. **Filament Resource**: `ResumeTemplateResource`
   - Location: `resume-builder-backend/app/Filament/Resources/ResumeTemplateResource.php`
   - Admin URL: `http://localhost:8000/superman/resume-templates`
   - Features:
     - Create, read, update, delete templates
     - Image upload with editor
     - Tag input for features and colors
     - Bulk actions (activate/deactivate)
     - Filtering by active status, premium status, and complexity
     - Sortable columns

4. **API Controller**: `TemplateController`
   - Location: `resume-builder-backend/app/Http/Controllers/Api/TemplateController.php`
   - Endpoints:
     - `GET /api/templates`: List all active templates
     - `GET /api/templates/{templateId}`: Get specific template
     - `GET /api/templates/categories`: Get all categories

5. **Seeder**: `ResumeTemplateSeeder`
   - Location: `resume-builder-backend/database/seeders/ResumeTemplateSeeder.php`
   - Seeds 22 templates with complete metadata

## API Endpoints

### List All Templates
```bash
GET /api/templates
```

**Query Parameters:**
- `premium` (boolean): Filter by premium status
- `complexity` (string): Filter by complexity level (beginner, intermediate, advanced)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "modern",
      "name": "Modern Executive",
      "category": "Best for Tech & SaaS",
      "description": "A sleek, modern template...",
      "preview_image": "http://localhost:8000/storage/...",
      "thumbnail_image": "http://localhost:8000/storage/...",
      "supported_colors": ["indigo", "emerald", "rose", "slate", "amber", "violet"],
      "features": ["Clean Layout", "ATS-Friendly", "Modern Design", "Professional"],
      "is_premium": false,
      "best_for": "Software Engineers, Product Managers, Tech Executives",
      "complexity_level": "intermediate"
    }
  ]
}
```

### Get Single Template
```bash
GET /api/templates/{templateId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "modern",
    "name": "Modern Executive",
    ...
  }
}
```

### Get Template Categories
```bash
GET /api/templates/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Best for Tech & SaaS",
    "Design & Marketing",
    "Formal & Corporate",
    ...
  ]
}
```

## Admin Panel Usage

### Accessing the Admin Panel
1. Navigate to `http://localhost:8000/superman/resume-templates`
2. You'll see a list of all templates with:
   - Thumbnail preview
   - Template ID (badge)
   - Name and category
   - Complexity level (color-coded badge)
   - Sort order
   - Active/Premium status

### Creating a New Template
1. Click "New Resume Template" button
2. Fill in the form:
   - **Template Information**:
     - Template ID (auto-slugified)
     - Name
     - Category
     - Description
     - Best For
   - **Template Features**:
     - Features (tag input)
     - Supported Colors (tag input)
   - **Images**:
     - Preview Image (900x1200px recommended)
     - Thumbnail Image (300x400px recommended)
   - **Settings**:
     - Complexity Level
     - Sort Order
     - Is Active
     - Is Premium
3. Click "Create"

### Editing a Template
1. Click the "Edit" icon next to any template
2. Modify the fields as needed
3. Click "Save changes"

### Bulk Actions
1. Select multiple templates using checkboxes
2. Choose from bulk actions:
   - Delete
   - Activate
   - Deactivate

### Filtering
Use the filter panel to filter by:
- Active status
- Premium status
- Complexity level

## Available Templates

The system includes 22 pre-seeded templates:

### Original Templates (4)
1. **Modern Executive** - Best for Tech & SaaS
2. **Creative Sidebar** - Design & Marketing
3. **Academic Elite** - Formal & Corporate
4. **Minimalist Bold** - Clean & Functional

### Executive & Professional (3)
5. **Executive** - Senior Leadership (Premium)
6. **Professional** - Corporate & Business
7. **Classic** - Traditional & Formal

### Modern & Tech (3)
8. **Tech Developer** - Software & Engineering
9. **Gradient Modern** - Creative & Bold (Premium)
10. **Infographic** - Visual & Creative (Premium)

### Minimalist & Clean (3)
11. **Swiss Style** - Minimalist & Clean
12. **Elegant** - Refined & Sophisticated (Premium)
13. **Vertical Accent** - Modern & Clean

### Structured & Organized (4)
14. **Timeline** - Chronological Focus
15. **Split Column** - Organized & Balanced
16. **Three Column** - Information Dense (Premium)
17. **Boxed Layout** - Structured & Clear

### Bold & Colorful (5)
18. **Bold Impact** - Strong & Confident
19. **Color Block** - Modern & Vibrant (Premium)
20. **Striped** - Dynamic & Engaging
21. **Bordered** - Classic & Framed
22. **Compact** - Space Efficient

## Frontend Integration

### Current Frontend Templates
The frontend templates are located at:
- `resume-builder-frontend/components/resume-builder/tabs/tab-templates.tsx`
- `resume-builder-frontend/components/resume-builder/templates/`

### Next Steps for Integration
1. Update the frontend to fetch templates from the API instead of hardcoded array
2. Display preview images from the backend
3. Filter templates based on user's subscription (free vs premium)
4. Add template preview modal with full details

## Database Commands

### Run Migration
```bash
cd resume-builder-backend
php artisan migrate
```

### Seed Templates
```bash
php artisan db:seed --class=ResumeTemplateSeeder
```

### Reset and Reseed
```bash
php artisan migrate:fresh --seed
```

## Image Upload

### Storage Configuration
Images are stored in:
- Preview images: `storage/app/public/template-previews/`
- Thumbnails: `storage/app/public/template-thumbnails/`

### Recommended Image Sizes
- **Preview Image**: 900x1200px (3:4 aspect ratio)
- **Thumbnail**: 300x400px (3:4 aspect ratio)

### Creating Symbolic Link
If images aren't showing, create a symbolic link:
```bash
php artisan storage:link
```

## Premium Templates

The following templates are marked as premium:
- Executive
- Gradient Modern
- Infographic
- Elegant
- Three Column
- Color Block

Premium templates require users to have an active subscription to use them.

## Complexity Levels

Templates are categorized by complexity:
- **Beginner**: Simple, easy-to-fill templates (Academic, Minimal, Classic, Vertical, Boxed, Bordered)
- **Intermediate**: Balanced complexity (Modern, Creative, Professional, Tech, Swiss, Elegant, Timeline, Split, Bold, Striped, Compact)
- **Advanced**: Complex layouts (Executive, Gradient, Infographic, Columnar, Colorblock)

## Future Enhancements

1. **Template Preview Generator**: Automatically generate preview images from template components
2. **Template Analytics**: Track which templates are most popular
3. **Template Ratings**: Allow users to rate templates
4. **Template Customization**: Allow users to customize template colors and fonts
5. **Template Versioning**: Track template versions and changes
6. **A/B Testing**: Test different template variations
7. **Template Categories**: Add more granular categorization
8. **Template Tags**: Add tagging system for better search

## Troubleshooting

### Templates Not Showing in Admin
- Check if migration ran successfully: `php artisan migrate:status`
- Check if seeder ran: `SELECT COUNT(*) FROM resume_templates;`

### Images Not Displaying
- Run `php artisan storage:link`
- Check file permissions on storage directory
- Verify images are uploaded to correct directory

### API Not Returning Templates
- Check if templates are active: `is_active = true`
- Verify API routes are registered: `php artisan route:list | grep templates`
- Check CORS settings if calling from frontend

## Support

For issues or questions, please refer to:
- Backend documentation: `resume-builder-backend/README.md`
- Frontend documentation: `resume-builder-frontend/README.md`
