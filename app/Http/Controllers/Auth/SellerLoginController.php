<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class SellerLoginController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest:seller')->except('logout');
    }

    public function showLoginForm()
    {
        return view('auth.seller-login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('seller')->attempt($credentials, $request->filled('remember'))) {
            if ($request->wantsJson()) {
                $user = Auth::guard('seller')->user();
                $token = $user->createToken('seller-token')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user], 200);
            }
            return redirect()->intended('/admin/dashboard');
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return back()->withInput($request->only('email', 'remember'))
                     ->withErrors(['email' => 'Invalid credentials']);
    }

    public function logout(Request $request)
    {
        Auth::guard('seller')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
