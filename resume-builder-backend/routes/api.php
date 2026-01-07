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
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\BlogController;

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

// Resume CRUD (with plan limits)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('resumes', [ResumeController::class, 'index']);
    Route::get('resumes/{resume}', [ResumeController::class, 'show']);
    Route::post('resumes', [ResumeController::class, 'store'])->middleware('plan.limit:resume');
    Route::put('resumes/{resume}', [ResumeController::class, 'update']);
    Route::delete('resumes/{resume}', [ResumeController::class, 'destroy']);
});

// File Upload (with AI limits)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('uploads/resume', [UploadController::class, 'uploadResume'])->middleware('plan.limit:ai');
    Route::get('uploads/{id}/status', [UploadController::class, 'getStatus']);
    Route::post('uploads/job-description', [UploadController::class, 'parseJobDescription'])->middleware('plan.limit:ai');
});

// PDF Export (with download limits)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('export/pdf', [PdfExportController::class, 'export'])->middleware('plan.limit:download_pdf');
});

// Pricing Plans
Route::get('/pricing-plans', [PricingPlanController::class, 'index']);

// Geolocation - Detect currency from IP
Route::get('/detect-currency', [GeolocationController::class, 'detectCurrency']);

// Contact
Route::get('/contact/settings', [ContactController::class, 'getSettings']);
Route::post('/contact/enquiry', [ContactController::class, 'submitEnquiry']);

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

// Plan Management
Route::middleware('auth:sanctum')->prefix('plan')->group(function () {
    Route::get('/current', [PlanController::class, 'getCurrentPlan']);
    Route::get('/check/{feature}', [PlanController::class, 'checkFeatureAccess']);
    Route::get('/usage', [PlanController::class, 'getUsageStats']);
});

// User Stats (Protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/stats', [UserStatsController::class, 'index']);
});

// ATS Analysis (with AI limits)
Route::middleware('auth:sanctum')->prefix('ats')->group(function () {
    Route::post('analyze', [ATSController::class, 'analyze'])->middleware('plan.limit:ai');
});

// Blog Routes
Route::prefix('blog')->group(function () {
    Route::get('posts', [BlogController::class, 'index']);
    Route::get('posts/{slug}', [BlogController::class, 'show']);
    Route::get('categories', [BlogController::class, 'categories']);
});
