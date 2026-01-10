# Live Preview with Skeleton/Placeholder Data

## Overview
Updated the live preview panel to always display the selected template with skeleton/placeholder data, even when the resume is completely blank. This allows users to preview templates before filling in any information.

## Changes Made

### Preview Panel (`components/resume-builder/preview-panel.tsx`)

#### Before:
- Showed "Loading preview..." when personal data was missing
- Required data to be filled before showing template
- Empty resume = no preview

#### After:
- Always shows the selected template
- Uses placeholder data for empty fields
- Users can see template design immediately

## Placeholder Data

### Personal Information
```typescript
{
    name: 'Your Name',
    title: 'Your Job Title',
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'City, State',
}
```

### Professional Summary
```
"Add a professional summary to highlight your key skills and experience. 
This section helps recruiters quickly understand your value proposition."
```

### Experience (if empty)
```typescript
[{
    id: 'placeholder-1',
    company: 'Company Name',
    position: 'Job Title',
    startDate: '2020-01',
    endDate: null,
    current: true,
    description: 'Describe your key responsibilities and achievements in this role. Use bullet points to highlight your impact and contributions.',
}]
```

### Education (if empty)
```typescript
[{
    id: 'placeholder-1',
    institution: 'University Name',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2016',
    endDate: '2020',
    gpa: '3.8',
}]
```

### Skills (if empty)
```typescript
[
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 
    'AWS', 'Docker', 'TypeScript', 'MongoDB'
]
```

## Implementation Logic

```typescript
// Use actual data if available, otherwise use placeholder
const displayPersonal = personal || {
    name: 'Your Name',
    title: 'Your Job Title',
    // ...
};

const displayExperience = experience.length > 0 ? experience : [
    {
        id: 'placeholder-1',
        company: 'Company Name',
        // ...
    },
];

// Pass display data to template
const templateProps = {
    personal: displayPersonal,
    summary: displaySummary,
    experience: formattedExperience,
    education: formattedEducation,
    skills: displaySkills,
    // ...
};
```

## User Experience

### Blank Resume Flow
1. **User visits** `/builder`
2. **Blank resume initialized**
3. **Live preview shows immediately**:
   - Template design visible
   - Placeholder text in all sections
   - Proper formatting and layout
   - Accent color applied

4. **User starts filling data**:
   - Placeholder text replaced with real data
   - Preview updates in real-time
   - Template structure remains consistent

### Template Switching
1. **User clicks "Templates" tab**
2. **Selects different template**
3. **Preview updates instantly**:
   - New template design shown
   - Placeholder data displayed
   - User can compare templates easily

## Benefits

1. **Immediate Visual Feedback** 👁️
   - Users see template design right away
   - No waiting for data to be filled
   - Better understanding of template structure

2. **Template Comparison** 🔄
   - Easy to switch between templates
   - Compare designs with consistent data
   - Make informed template selection

3. **Better UX** ✨
   - No blank/empty preview panel
   - Professional appearance from start
   - Guides users on what to fill

4. **Reduced Confusion** 🎯
   - Clear indication of what goes where
   - Placeholder text provides examples
   - Users understand expected format

5. **Faster Onboarding** 🚀
   - New users see value immediately
   - Don't need to fill data to preview
   - Encourages template exploration

## Display Priority

The system uses this priority for displaying data:

1. **User's actual data** (if available)
2. **Placeholder data** (if field is empty)

This ensures:
- Real data always takes precedence
- No empty sections in preview
- Smooth transition from placeholder to real data

## Edge Cases Handled

### Empty Personal Object
```typescript
const displayPersonal = personal || { name: 'Your Name', ... };
```
- If `personal` is `null` or `undefined`, use placeholder
- Prevents "Loading preview..." message
- Template always renders

### Empty Arrays
```typescript
const displayExperience = experience.length > 0 ? experience : [placeholder];
```
- If array is empty, show one placeholder item
- Demonstrates section layout
- Shows expected data structure

### Partial Data
- If user fills some fields but not others
- Real data shown for filled fields
- Placeholder shown for empty fields
- Seamless mixing of both

## Template Compatibility

All templates support placeholder data:
- ✅ Modern
- ✅ Creative
- ✅ Academic
- ✅ Minimal
- ✅ Executive
- ✅ Professional
- ✅ Classic
- ✅ Tech
- ✅ Gradient
- ✅ Infographic
- ✅ Swiss
- ✅ Elegant
- ✅ Vertical
- ✅ Timeline
- ✅ Split
- ✅ Columnar
- ✅ Boxed
- ✅ Bold
- ✅ ColorBlock
- ✅ Striped
- ✅ Bordered
- ✅ Compact

## Future Enhancements

1. **Customizable Placeholders**: Allow users to set their own placeholder text
2. **Industry-Specific Placeholders**: Different placeholders for different industries
3. **Localized Placeholders**: Translate placeholders to user's language
4. **Smart Placeholders**: AI-generated suggestions based on job title
5. **Placeholder Styling**: Subtle visual distinction between placeholder and real data
6. **Hide Placeholders Option**: Toggle to show/hide placeholder data

## Testing Checklist

- [x] Blank resume shows template with placeholders
- [x] All templates render with placeholder data
- [x] Real data replaces placeholders when entered
- [x] Template switching works with placeholders
- [x] Color changes apply to placeholder content
- [x] Zoom works with placeholder content
- [x] PDF export works (with real data only)
- [x] No console errors with placeholder data
- [x] Mobile preview shows placeholders
- [x] Multi-page indicator uses display data
