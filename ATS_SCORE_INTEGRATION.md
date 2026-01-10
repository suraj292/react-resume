# ATS Score Integration with Resume Save

## Overview
Implemented automatic ATS score saving when exporting resumes from the `/builder` page. The ATS score is retrieved from the cache and saved along with the resume data to the backend.

## Changes Made

### 1. **Resume Store** (`lib/stores/resume-store.ts`)

#### Updated Resume Interface
Added `ats_score` field to the Resume interface:
```typescript
export interface Resume {
    id: string;
    title: string;
    personal: PersonalInfo;
    social?: SocialMedia;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    templateId: string;
    colorId: string;
    ats_score?: number | null;  // ✨ NEW
    data: any;
    etag: string | null;
    lastSavedAt: Date | null;
}
```

#### Enhanced saveResume Function
The `saveResume` function now:

1. **Retrieves ATS Score from Cache**:
   ```typescript
   // Get ATS score from cache if available
   let atsScore = currentResume.ats_score;
   if (typeof window !== 'undefined') {
       try {
           const { atsCache } = await import('@/lib/ats-cache');
           const cachedScore = atsCache.getCachedScore();
           if (cachedScore !== null) {
               atsScore = cachedScore;
           }
       } catch (error) {
           console.error('Failed to get ATS score from cache:', error);
       }
   }
   ```

2. **Includes ATS Score in Payload**:
   ```typescript
   const payload = {
       title: currentResume.title,
       data: { ... },
       template_id: currentResume.templateId,
       color_id: currentResume.colorId,
       ats_score: atsScore,  // ✨ Included in save
   };
   ```

#### Updated setResume Function
Maps `ats_score` from API response to store:
```typescript
const mappedResume = {
    ...resume,
    // ... other fields
    ats_score: apiResume.ats_score || resume.ats_score || null,
};
```

### 2. **My Resume Page** (`app/(dashboard)/my-resume/page.tsx`)

The page already displays ATS scores from the API response:
- Shows color-coded badges (green ≥85, yellow ≥70, red <70)
- Calculates average ATS score across all resumes
- Displays "Not Scored" for resumes without ATS data

## Data Flow

### When Exporting PDF:

1. **User clicks "Export PDF"** in `/builder`
2. **Navbar triggers save**:
   - Calls `saveResume()` from resume store
3. **Resume store retrieves ATS score**:
   - Checks `atsCache.getCachedScore()`
   - Uses cached score if available
   - Falls back to existing score or null
4. **API request sent**:
   ```json
   PUT /api/resumes/{id}
   {
     "title": "...",
     "data": { ... },
     "template_id": "modern",
     "color_id": "indigo",
     "ats_score": 85
   }
   ```
5. **Backend saves** resume with ATS score
6. **Resume appears** in `/my-resume` with score badge

### When Loading Resumes:

1. **User visits** `/my-resume`
2. **API returns** resumes with ATS scores:
   ```json
   [
     {
       "id": 1,
       "title": "...",
       "ats_score": 85,
       ...
     }
   ]
   ```
3. **Frontend displays** color-coded badges
4. **Average score** calculated and shown in insight bar

## ATS Cache Structure

The ATS cache (`lib/ats-cache.ts`) stores:
```typescript
interface ATSCacheData {
    resumeText: string;
    analysisResult: any;
    timestamp: number;
    userId?: string;
}
```

### Cache Methods Used:
- `getCachedScore()` - Returns the ATS score (0-100)
- `getCachedAnalysis()` - Returns full analysis result
- `hasCached()` - Checks if valid cache exists
- `clearCache()` - Removes cached data

## Benefits

1. **Persistent ATS Scores**: Scores are saved to database, not just localStorage
2. **Cross-Device Access**: Users can see their ATS scores on any device
3. **Historical Tracking**: Scores are preserved even after cache expires
4. **Better UX**: Users don't need to re-run ATS analysis
5. **Performance**: Reduces unnecessary API calls to ATS service

## Database Schema

The `resumes` table includes:
```sql
ats_score INT NULL  -- ATS compatibility score (0-100)
```

## Edge Cases Handled

1. **No Cache Available**: Falls back to existing score or null
2. **Cache Import Fails**: Catches error and continues with save
3. **Server-Side Rendering**: Checks `typeof window !== 'undefined'`
4. **Null Scores**: Properly handles and displays "Not Scored" badge
5. **Score Updates**: New ATS analysis overwrites old score

## UI Display

### Resume Card Badges:
- **Green** (≥85): `bg-green-50 text-green-700 border-green-100`
- **Yellow** (≥70): `bg-yellow-50 text-yellow-700 border-yellow-100`
- **Red** (<70): `bg-red-50 text-red-700 border-red-100`
- **Not Scored**: `bg-slate-100 text-slate-500 border-slate-200`

### Average Score Bar:
Shows when at least one resume has a score:
```tsx
{avgScore > 0 && (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50">
        Your average ATS score is {avgScore}/100
    </div>
)}
```

## Testing Checklist

- [x] ATS score saved when exporting PDF
- [x] Score retrieved from cache correctly
- [x] Score displayed in `/my-resume` page
- [x] Color-coded badges work correctly
- [x] Average score calculation is accurate
- [x] Handles missing/null scores gracefully
- [x] Works with server-side rendering
- [x] Cache import errors don't break save

## Future Enhancements

1. **Score History**: Track score changes over time
2. **Score Trends**: Show improvement/decline graphs
3. **Score Breakdown**: Display detailed ATS metrics
4. **Score Alerts**: Notify when score drops below threshold
5. **Bulk Analysis**: Analyze multiple resumes at once
6. **Score Comparison**: Compare scores across templates
