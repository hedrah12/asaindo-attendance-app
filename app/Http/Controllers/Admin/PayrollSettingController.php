<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayrollSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollSettingController extends Controller
{
    public function index()
    {
        $settings = PayrollSetting::all()->groupBy('group');
        return Inertia::render('Admin/Settings/Payroll', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $updates = $request->get('settings'); // Array of [key => value]
        
        foreach ($updates as $key => $value) {
            $setting = PayrollSetting::where('key', $key)->first();
            if ($setting) {
                // Ensure boolean stays as string "true"/"false" for storage if needed, 
                // but our model handle casting.
                $setting->update(['value' => $value]);
            }
        }

        return back()->with('success', 'Kebijakan penggajian berhasil diperbarui.');
    }
}
