<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ParseResumeJob;
use App\Models\ResumeUpload;
use App\Services\AIService;
use App\Traits\TracksUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    use TracksUsage;

    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Upload and async-parse a resume file.
     */
    public function uploadResume(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10 MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        try {
            $file         = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType     = $file->getMimeType();
            $fileSize     = $file->getSize();

            $path = $file->store('resumes', 'local');

            $upload = ResumeUpload::create([
                'user_id'             => $user->id,  // always from auth, not client
                'file_path'           => $path,
                'original_name'       => $originalName,
                'mime_type'           => $mimeType,
                'file_size'           => $fileSize,
                'status'              => 'pending',
                'processing_progress' => 0,
            ]);

            ParseResumeJob::dispatch($upload->id);

            // Track AI usage at dispatch time so the limit check is accurate
            $this->trackAIRequest(
                $user->id,
                'resume_upload_parse',
                null,
                null,
                null,
                null,
                'success'
            );

            return response()->json([
                'message'   => 'File uploaded successfully',
                'upload_id' => $upload->id,
                'status'    => 'pending',
            ], 201);

        } catch (\Exception $e) {
            Log::error('upload.resume_failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'File upload failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Get upload processing status.
     */
    public function getStatus($id)
    {
        $user   = Auth::user();
        $upload = ResumeUpload::where('id', $id)
            ->where('user_id', $user->id) // ownership check
            ->first();

        if (!$upload) {
            return response()->json(['message' => 'Upload not found.'], 404);
        }

        return response()->json([
            'id'           => $upload->id,
            'status'       => $upload->status,
            'progress'     => $upload->processing_progress,
            'parsed_data'  => $upload->parsed_data,
            'error_message'=> $upload->error_message,
            'created_at'   => $upload->created_at,
            'updated_at'   => $upload->updated_at,
        ]);
    }

    /**
     * Parse job description text (AI).
     */
    public function parseJobDescription(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        try {
            $parsed = $this->aiService->parseJobDescription($request->text);

            $this->trackAIRequest(
                $user->id,
                'job_description_parse',
                null,
                null,
                null,
                null,
                'success'
            );

            return response()->json([
                'message' => 'Job description parsed successfully',
                'data'    => $parsed,
            ]);

        } catch (\Exception $e) {
            $this->trackAIRequest(
                $user->id,
                'job_description_parse',
                null,
                null,
                null,
                null,
                'error',
                $e->getMessage()
            );

            Log::error('upload.job_desc_parse_failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Parsing failed. Please try again.',
            ], 500);
        }
    }
}
