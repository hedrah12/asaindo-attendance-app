<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return \Inertia\Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Ensure user has admin role to access web dashboard
            if (!$user->hasRole('admin')) {
                // Check if they should be admin (special cases)
                if (strcasecmp($user->name, 'Iqbal Maulana') === 0 || $user->email === 'admin@gmail.com') {
                    $user->assignRole('admin');
                } else {
                    Auth::logout();
                    return back()->withErrors([
                        'email' => 'Akses ditolak. Karyawan hanya dapat login melalui aplikasi mobile.',
                    ]);
                }
            }

            $request->session()->regenerate();
            return redirect()->intended('admin');
        }

        return back()->withErrors([
            'email' => 'Kredensial yang diberikan tidak cocok dengan data kami.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect(url('login'));
    }
}
