<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to provider
     */
    public function redirectToProvider($provider)
    {
        $this->validateProvider($provider);

        $driver = Socialite::driver($provider)->stateless();
        
        // Add scopes for GitHub to get email
        if ($provider === 'github') {
            $driver->scopes(['read:user', 'user:email']);
        }
        
        return $driver->redirect();
    }

    /**
     * Handle provider callback
     */
    public function handleProviderCallback($provider)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('OAuth callback error for ' . $provider . ': ' . $e->getMessage());
            
            // Redirect to frontend auth page with error
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect($frontendUrl . '/login?error=oauth_failed&provider=' . $provider);
        }

        // Get email - handle GitHub's private email case
        $email = $socialUser->getEmail();
        
        // If GitHub user has private email, generate a unique email
        if (!$email && $provider === 'github') {
            $email = $socialUser->getId() . '+' . $socialUser->getNickname() . '@users.noreply.github.com';
        }
        
        // If still no email, redirect with error
        if (!$email) {
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect($frontendUrl . '/login?error=no_email&provider=' . $provider);
        }

        // Find or create user
        $user = User::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if (!$user) {
            // Check if user exists with same email
            $user = User::where('email', $email)->first();

            if ($user) {
                // Link this provider to existing user
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                // Get name from social provider
                $name = $socialUser->getName() ?: $socialUser->getNickname() ?: 'User';
                
                // Create new user
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'avatar' => $socialUser->getAvatar(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'email_verified_at' => now(), // Auto-verify email for social logins
                    'password' => null, // No password for social login
                ]);
            }
        } else {
            // Update avatar if changed
            if ($socialUser->getAvatar() !== $user->avatar) {
                $user->update(['avatar' => $socialUser->getAvatar()]);
            }
        }

        // Log the user in with session
        auth()->login($user, true);

        // Create token for the user
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Store in session
        session([
            'auth_token' => $token,
            'user_id' => $user->id,
            'social_login' => true
        ]);
        
        // Force session save
        session()->save();

        // Redirect to frontend with token
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
        return redirect($frontendUrl . '/auth/callback?token=' . urlencode($token));
    }

    /**
     * Validate provider
     */
    protected function validateProvider($provider)
    {
        $allowedProviders = ['google', 'linkedin', 'github'];

        if (!in_array($provider, $allowedProviders)) {
            abort(400, 'Invalid provider');
        }
    }
}
