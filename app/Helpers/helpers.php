<?php

use Illuminate\Support\Facades\Auth;

if (!function_exists('currentUserType')) {
    /**
     * Get the currently logged-in user type.
     *
     * @return string
     */
    function currentUserType()
    {
        if (Auth::guard('seller')->check()) {
            return 'seller';
        }

        if (Auth::guard('web')->check()) {
            return 'customer';
        }

        return 'guest';
    }
}

if (!function_exists('currentUser')) {
    /**
     * Get the currently logged-in user (from any guard).
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    function currentUser()
    {
        if (Auth::guard('seller')->check()) {
            return Auth::guard('seller')->user();
        }

        if (Auth::guard('web')->check()) {
            return Auth::guard('web')->user();
        }

        return null;
    }
}
