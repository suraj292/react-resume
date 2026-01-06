<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\PdfExportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Resume CRUD (temporarily without auth for testing)
Route::apiResource('resumes', ResumeController::class);

// File Upload
Route::post('uploads/resume', [UploadController::class, 'uploadResume']);
Route::get('uploads/{id}/status', [UploadController::class, 'getStatus']);
Route::post('uploads/job-description', [UploadController::class, 'parseJobDescription']);

// PDF Export
Route::post('export/pdf', [PdfExportController::class, 'export']);

// Auth-protected routes (for later)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });
});
