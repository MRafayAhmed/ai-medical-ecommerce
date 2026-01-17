<?php

namespace App\Livewire\Actions;

use Illuminate\Support\Facades\Auth;

class Logout
{
    /**
     * Log the current user out of the application.
     */
    public function __invoke()
    {
        // Log out the user
        Auth::guard('web')->logout();

        // Invalidate and regenerate session for security
        session()->invalidate();
        session()->regenerateToken();

        // Redirect to home page
        return redirect('/');
    }
}
