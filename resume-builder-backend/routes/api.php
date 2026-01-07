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
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\PricingPlanController;
use App\Http\Controllers\Api\GeolocationController;
use App\Http\Controllers\Api\UserStatsController;
use App\Http\Controllers\Api\PaymentController;

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

// Pricing Plans
Route::get('/pricing-plans', [PricingPlanController::class, 'index']);

// Geolocation - Detect currency from IP
Route::get('/detect-currency', [GeolocationController::class, 'detectCurrency']);

// Coupons
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/coupons/validate', [CouponController::class, 'validate']);
    Route::post('/coupons/apply', [CouponController::class, 'apply']);
});

// Payments (Razorpay)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
});

// User Stats (Protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/stats', [UserStatsController::class, 'index']);
});

// ATS Analysis
Route::prefix('ats')->group(function () {
    Route::post('analyze', [ATSController::class, 'analyze']);
});
