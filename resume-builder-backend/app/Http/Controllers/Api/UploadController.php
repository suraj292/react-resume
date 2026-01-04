<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ParseResumeJob;
use App\Models\ResumeUpload;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Upload and parse resume file
     */
    public function uploadResume(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();

            // Store file
            $path = $file->store('resumes', 'local');

            // Create upload record
            $upload = ResumeUpload::create([
                'user_id' => 1, // TODO: Get from auth when implemented
                'file_path' => $path,
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'file_size' => $fileSize,
                'status' => 'pending',
                'processing_progress' => 0,
            ]);

            // Dispatch parsing job
            ParseResumeJob::dispatch($upload->id);

            return response()->json([
                'message' => 'File uploaded successfully',
                'upload_id' => $upload->id,
                'status' => 'pending',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('File upload failed', ['error' => $e->getMessage()]);
            
            return response()->json([
                'message' => 'File upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get upload status and parsed data
     */
    public function getStatus($id)
    {
        $upload = ResumeUpload::find($id);

        if (!$upload) {
            return response()->json([
                'message' => 'Upload not found',
            ], 404);
        }

        return response()->json([
            'id' => $upload->id,
            'status' => $upload->status,
            'progress' => $upload->processing_progress,
            'parsed_data' => $upload->parsed_data,
            'error_message' => $upload->error_message,
            'created_at' => $upload->created_at,
            'updated_at' => $upload->updated_at,
        ]);
    }

    /**
     * Parse job description text
     */
    public function parseJobDescription(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $parsed = $this->aiService->parseJobDescription($request->text);

            return response()->json([
                'message' => 'Job description parsed successfully',
                'data' => $parsed,
            ]);
        } catch (\Exception $e) {
            \Log::error('Job description parsing failed', ['error' => $e->getMessage()]);
            
            return response()->json([
                'message' => 'Parsing failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
