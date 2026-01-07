# Plan-Based Feature Access Control

## Overview
This system implements plan-based feature restrictions for the resume builder and ATS checker based on user subscriptions.

## Database Schema

### Tables Created
1. **downloads** - Tracks user downloads (PDF/DOCX)
2. **ai_requests** - Tracks AI feature usage (resume parsing, ATS checking)
3. **resumes** - Already exists, tracks user-created resumes

### Pricing Plan Limits (from `pricing_plans` table)
- `max_resumes` - Maximum number of resumes (NULL = unlimited)
- `max_templates` - Number of accessible templates (NULL = unlimited)
- `max_downloads_per_month` - Monthly download limit (NULL = unlimited)
- `max_ai_requests_per_month` - Monthly AI request limit (NULL = unlimited)
- `can_export_pdf` - Boolean for PDF export permission
- `can_export_docx` - Boolean for DOCX export permission

## Core Components

### 1. PlanAccessService (`app/Services/PlanAccessService.php`)
Central service for checking plan limits and permissions.

**Key Methods:**
- `getUserPlan(User $user)` - Get user's current plan
- `canCreateResume(User $user)` - Check if user can create more resumes
- `canDownload(User $user, string $format)` - Check download permission
- `canUseAI(User $user)` - Check AI feature access
- `getPlanLimits(User $user)` - Get comprehensive limit summary

### 2. CheckPlanLimit Middleware (`app/Http/Middleware/CheckPlanLimit.php`)
Enforces plan limits on API endpoints.

**Usage:**
```php
Route::post('resumes', [ResumeController::class, 'store'])
    ->middleware('plan.limit:resume');
```

**Supported Features:**
- `resume` - Creating new resumes
- `download_pdf` - PDF exports
- `download_docx` - DOCX exports
- `ai` - AI features (parsing, ATS checking)

### 3. User Model Extensions
Added helper methods to User model:

```php
$user->canCreateResume();  // bool
$user->canDownload('pdf'); // bool
$user->canUseAI();         // bool
$user->getPlanLimits();    // array
$user->getCurrentPlan();   // PricingPlan|null
```

### 4. TracksUsage Trait (`app/Traits/TracksUsage.php`)
Helper methods for tracking usage in controllers.

```php
use App\Traits\TracksUsage;

class PdfExportController extends Controller
{
    use TracksUsage;
    
    public function export(Request $request)
    {
        // ... export logic ...
        
        $this->trackDownload(
            userId: $request->user()->id,
            resumeId: $resumeId,
            format: 'pdf',
            filePath: $filePath,
            fileSize: $fileSize,
            request: $request
        );
    }
}
```

## API Endpoints

### Plan Management Routes
```
GET /api/plan/current          - Get current plan and limits
GET /api/plan/check/{feature}  - Check specific feature access
GET /api/plan/usage            - Get usage statistics
```

### Protected Routes with Plan Limits
```
POST /api/resumes              - middleware('plan.limit:resume')
POST /api/export/pdf           - middleware('plan.limit:download_pdf')
POST /api/uploads/resume       - middleware('plan.limit:ai')
POST /api/ats/analyze          - middleware('plan.limit:ai')
```

## Response Format

### Success Response (Feature Accessible)
```json
{
  "data": { ... }
}
```

### Error Response (Limit Reached)
```json
{
  "error": "Plan limit reached",
  "message": "You've reached your plan's resume limit (5). Upgrade to create more resumes.",
  "limits": {
    "plan_name": "Basic",
    "plan_slug": "basic",
    "resumes": {
      "limit": 5,
      "used": 5,
      "remaining": 0
    },
    "downloads": {
      "limit": 10,
      "used": 3,
      "remaining": 7
    },
    "ai_requests": {
      "limit": 5,
      "used": 2,
      "remaining": 3
    },
    "can_export_pdf": true,
    "can_export_docx": false
  },
  "upgrade_required": true
}
```

## Frontend Integration

### 1. Check Plan Limits on Page Load
```typescript
const { data: planData } = await fetch('/api/plan/current');
console.log(planData.limits);
```

### 2. Check Before Action
```typescript
const { data } = await fetch('/api/plan/check/resume');
if (!data.can_access) {
  // Show upgrade modal
  showUpgradeModal(data.limits);
} else {
  // Proceed with action
  createResume();
}
```

### 3. Handle 403 Errors
```typescript
try {
  await fetch('/api/resumes', { method: 'POST', ... });
} catch (error) {
  if (error.status === 403 && error.data.upgrade_required) {
    showUpgradeModal(error.data.limits);
  }
}
```

## Implementation Checklist

### Backend (✅ Completed)
- [x] Create migrations for downloads and ai_requests tables
- [x] Create Download and AiRequest models
- [x] Create PlanAccessService
- [x] Create CheckPlanLimit middleware
- [x] Add helper methods to User model
- [x] Create PlanController
- [x] Add plan routes to api.php
- [x] Create TracksUsage trait

### Frontend (⏳ To Do)
- [ ] Create plan context/hook for React
- [ ] Add plan limit checks before actions
- [ ] Create upgrade modal component
- [ ] Display usage statistics in profile
- [ ] Show plan limits in UI
- [ ] Handle 403 errors globally

### Controllers to Update (⏳ To Do)
- [ ] PdfExportController - Add trackDownload() call
- [ ] UploadController - Add trackAIRequest() call
- [ ] ATSController - Add trackAIRequest() call
- [ ] ResumeController - Already protected by middleware

## Example: Tracking Downloads

```php
// In PdfExportController.php
use App\Traits\TracksUsage;

class PdfExportController extends Controller
{
    use TracksUsage;
    
    public function export(Request $request)
    {
        $user = $request->user();
        
        // Generate PDF
        $pdf = $this->generatePdf($request->all());
        $filePath = storage_path('app/exports/' . $filename);
        $fileSize = filesize($filePath);
        
        // Track the download
        $this->trackDownload(
            userId: $user->id,
            resumeId: $request->resume_id,
            format: 'pdf',
            filePath: $filePath,
            fileSize: $fileSize,
            request: $request
        );
        
        return response()->download($filePath);
    }
}
```

## Example: Tracking AI Requests

```php
// In ATSController.php
use App\Traits\TracksUsage;

class ATSController extends Controller
{
    use TracksUsage;
    
    public function analyze(Request $request)
    {
        $user = $request->user();
        
        try {
            // Call AI service
            $result = $this->geminiService->analyzeResume($request->resume_data);
            
            // Track successful AI request
            $this->trackAIRequest(
                userId: $user->id,
                type: 'ats_check',
                resumeId: $request->resume_id,
                requestData: json_encode($request->resume_data),
                responseData: json_encode($result),
                tokensUsed: $result['tokens_used'] ?? null,
                status: 'success'
            );
            
            return response()->json($result);
            
        } catch (\Exception $e) {
            // Track failed AI request
            $this->trackAIRequest(
                userId: $user->id,
                type: 'ats_check',
                resumeId: $request->resume_id,
                requestData: json_encode($request->resume_data),
                status: 'failed',
                errorMessage: $e->getMessage()
            );
            
            throw $e;
        }
    }
}
```

## Testing

### Test Plan Limits
```bash
# Create test user with basic plan
php artisan tinker
>>> $user = User::find(1);
>>> $user->canCreateResume();  // Check resume limit
>>> $user->canDownload('pdf'); // Check download limit
>>> $user->canUseAI();         // Check AI limit
>>> $user->getPlanLimits();    // View all limits
```

### Test Middleware
```bash
# Try creating resume beyond limit
curl -X POST http://localhost:8000/api/resumes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Resume"}'
```

## Notes
- All limits reset monthly (downloads and AI requests)
- Resume count is cumulative (doesn't reset)
- Cache is used for plan lookups (1 hour TTL)
- Clear cache after plan changes: `app(PlanAccessService::class)->clearUserPlanCache($user)`
