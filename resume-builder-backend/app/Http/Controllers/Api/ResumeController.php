<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ResumeController extends Controller
{
    /**
     * Display a listing of the user's resumes (including soft-deleted).
     */
    public function index()
    {
        // For testing: return all resumes if no auth
        if (!Auth::check()) {
            return response()->json(Resume::withTrashed()->get());
        }
        
        // Include soft-deleted resumes so frontend can show deleted view
        $resumes = Auth::user()->resumes()
            ->withTrashed()
            ->latest()
            ->get();

        return response()->json($resumes);
    }

    /**
     * Store a newly created resume.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'data' => 'required|array',
            'template_id' => 'nullable|string',
            'color_id' => 'nullable|string',
            'ats_score' => 'nullable|integer|min:0|max:100',
            'ats_data' => 'nullable|array',
        ]);

        // For testing: use first user if no auth
        $userId = Auth::id() ?? 1;

        $resume = Resume::create([
            'user_id' => $userId,
            'title' => $validated['title'] ?? 'Untitled Resume',
            'data' => $validated['data'],
            'template_id' => $validated['template_id'] ?? 'modern',
            'color_id' => $validated['color_id'] ?? 'indigo',
        ]);

        return response()->json($resume, 201)
            ->header('ETag', $resume->etag);
    }

    /**
     * Display the specified resume (including soft-deleted).
     */
    public function show($id)
    {
        // Include soft-deleted resumes
        $resume = Resume::withTrashed()->findOrFail($id);

        return response()->json($resume)
            ->header('ETag', $resume->etag);
    }

    /**
     * Update the specified resume (auto-save - partial update).
     */
    public function update(Request $request, $id)
    {
        $resume = Resume::findOrFail($id);

        // Check ETag for conflict detection
        $clientEtag = $request->header('If-Match');
        if ($clientEtag && $clientEtag !== $resume->etag) {
            return response()->json([
                'message' => 'Conflict: Resume was modified by another session',
                'current_etag' => $resume->etag,
            ], 412); // 412 Precondition Failed
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'data' => 'sometimes|array',
            'template_id' => 'sometimes|string',
            'color_id' => 'sometimes|string',
            'ats_score' => 'sometimes|integer|min:0|max:100',
            'ats_data' => 'sometimes|array',
        ]);

        $resume->update($validated);
        $resume->refresh();

        return response()->json($resume)
            ->header('ETag', $resume->etag);
    }

    /**
     * Remove the specified resume (soft delete).
     */
    public function destroy($id)
    {
        $resume = Resume::findOrFail($id);
        $resume->delete();

        return response()->json(null, 204);
    }

    /**
     * Restore a soft-deleted resume.
     */
    public function restore($id)
    {
        $resume = Resume::withTrashed()->findOrFail($id);
        $resume->restore();

        return response()->json($resume);
    }
}
