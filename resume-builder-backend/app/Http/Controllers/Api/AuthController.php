<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PlanAccessService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function __construct(private PlanAccessService $planService) {}

    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth-token')->plainTextToken;

        Log::info('auth.registered', ['user_id' => $user->id]);

        return response()->json([
            'message'                    => 'Registration successful. Please verify your email.',
            'user'                       => $this->userPayload($user),
            'token'                      => $token,
            'email_verification_required'=> true,
        ], 201);
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        Log::info('auth.login', ['user_id' => $user->id]);

        return response()->json([
            'message'        => 'Login successful',
            'user'           => $this->userPayload($user),
            'token'          => $token,
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    /**
     * Logout — revoke current Sanctum token.
     */
    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            $hashed = hash('sha256', explode('|', $token, 2)[1] ?? '');
            PersonalAccessToken::where('token', $hashed)->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * GET /api/auth/me — fully standardised user + plan payload.
     */
    public function me(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $hashed = hash('sha256', explode('|', $token, 2)[1] ?? '');
        $pat    = PersonalAccessToken::where('token', $hashed)->first();

        if (!$pat) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        /** @var User $user */
        $user = $pat->tokenable;

        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    /**
     * Resend verification email.
     */
    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email sent.']);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Standardised user payload returned by login / register / me.
     * Always includes plan + subscription summary.
     */
    private function userPayload(User $user): array
    {
        return [
            'id'                  => $user->id,
            'name'                => $user->name,
            'email'               => $user->email,
            'email_verified_at'   => $user->email_verified_at?->toIso8601String(),
            'avatar'              => $user->avatar,
            'provider'            => $user->provider,
            'job_title'           => $user->job_title ?? null,
            'phone'               => $user->phone ?? null,
            'location'            => $user->location ?? null,
            'currency_preference' => $user->currency_preference ?? 'INR',
            'created_at'          => $user->created_at?->toIso8601String(),
            // Plan fields (from DB, not random client data)
            'plan'                => $this->planService->getUserPlan($user)?->only(['slug', 'name']) ?? ['slug' => 'free', 'name' => 'Free'],
            'subscription'        => $this->planService->getSubscriptionSummary($user),
            'limits'              => $this->planService->getPlanLimits($user),
        ];
    }
}
