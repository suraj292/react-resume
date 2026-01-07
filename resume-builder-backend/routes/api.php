<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\PdfExportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SocialAuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\ATSController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::prefix('auth')->group(function () {
    // Standard auth
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Protected auth routes - MUST come before {provider} routes
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:sanctum');
    
    // Social auth - MUST come after specific routes
    Route::get('{provider}', [SocialAuthController::class, 'redirectToProvider']);
    Route::get('{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);
});


// Email Verification Routes
Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');

// Resume CRUD (temporarily without auth for testing)
Route::apiResource('resumes', ResumeController::class);

// File Upload
Route::post('uploads/resume', [UploadController::class, 'uploadResume']);
Route::get('uploads/{id}/status', [UploadController::class, 'getStatus']);
Route::post('uploads/job-description', [UploadController::class, 'parseJobDescription']);

// PDF Export
Route::post('export/pdf', [PdfExportController::class, 'export']);

// ATS Analysis
Route::prefix('ats')->group(function () {
    Route::post('analyze', [ATSController::class, 'analyze']);
});
