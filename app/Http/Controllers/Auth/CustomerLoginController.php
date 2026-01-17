<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerLoginController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest:customer')->except('logout');
    }

    public function showLoginForm()
    {
        return view('auth.customer-login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('customer')->attempt($credentials, $request->filled('remember'))) {
            if ($request->wantsJson()) {
                $user = Auth::guard('customer')->user();
                $token = $user->createToken('customer-token')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user], 200);
            }
            return redirect()->intended('/home');
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return back()->withInput($request->only('email', 'remember'))
                     ->withErrors(['email' => 'Invalid credentials']);
    }

    public function logout(Request $request)
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/customer/login');
    }
}
