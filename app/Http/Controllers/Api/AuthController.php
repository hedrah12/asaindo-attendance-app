<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_id' => 'required',
            'push_token' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        // Device Binding Logic
        if ($user->device_id && $user->device_id !== $request->device_id) {
            return response()->json([
                'message' => 'Akun ini sudah terkait dengan perangkat lain.'
            ], 403);
        }

        if (! $user->device_id) {
            $user->device_id = $request->device_id;
        }

        if ($request->push_token) {
            $user->push_token = $request->push_token;
        }

        if ($user->isDirty()) {
            $user->save();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updatePushToken(Request $request)
    {
        $request->validate([
            'push_token' => 'required|string',
        ]);

        $user = $request->user();
        $user->push_token = $request->push_token;
        $user->save();

        return response()->json([
            'message' => 'Push token updated successfully'
        ]);
    }
}
