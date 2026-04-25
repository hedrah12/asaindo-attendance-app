<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PayrollSetting;

class PayrollSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Late Penalty
            ['key' => 'late_penalty_active', 'value' => 'true', 'type' => 'boolean', 'label' => 'Aktifkan Denda Terlambat', 'group' => 'late_penalty'],
            ['key' => 'late_penalty_nominal', 'value' => '5000', 'type' => 'integer', 'label' => 'Nominal Denda', 'group' => 'late_penalty'],
            ['key' => 'late_penalty_interval', 'value' => '10', 'type' => 'integer', 'label' => 'Per Berapa Menit', 'group' => 'late_penalty'],
            ['key' => 'late_penalty_stop_time', 'value' => '09:00', 'type' => 'string', 'label' => 'Denda Berhenti pada Jam', 'group' => 'late_penalty'],
            ['key' => 'late_tolerance_minutes', 'value' => '5', 'type' => 'integer', 'label' => 'Batas Toleransi (Menit)', 'group' => 'late_penalty'],
            
            // Paid Leave (Fixed/Bulanan)
            ['key' => 'fixed_paid_izin', 'value' => 'true', 'type' => 'boolean', 'label' => 'Izin Berbayar (Tetap)', 'group' => 'leave'],
            ['key' => 'fixed_paid_sakit', 'value' => 'true', 'type' => 'boolean', 'label' => 'Sakit Berbayar (Tetap)', 'group' => 'leave'],
            ['key' => 'fixed_paid_cuti', 'value' => 'true', 'type' => 'boolean', 'label' => 'Cuti Berbayar (Tetap)', 'group' => 'leave'],
            
            // Paid Leave (Daily/Harian)
            ['key' => 'daily_paid_izin', 'value' => 'false', 'type' => 'boolean', 'label' => 'Izin Berbayar (Harian)', 'group' => 'leave'],
            ['key' => 'daily_paid_sakit', 'value' => 'false', 'type' => 'boolean', 'label' => 'Sakit Berbayar (Harian)', 'group' => 'leave'],
            ['key' => 'daily_paid_cuti', 'value' => 'false', 'type' => 'boolean', 'label' => 'Cuti Berbayar (Harian)', 'group' => 'leave'],
            
            // Allowance Rules (Fixed/Tetap)
            ['key' => 'fixed_transport_on_late', 'value' => 'false', 'type' => 'boolean', 'label' => 'Transport Cair Jika Telat (Tetap)', 'group' => 'allowance'],
            ['key' => 'fixed_food_on_late', 'value' => 'true', 'type' => 'boolean', 'label' => 'Makan Cair Jika Telat (Tetap)', 'group' => 'allowance'],
            ['key' => 'fixed_transport_on_leave', 'value' => 'false', 'type' => 'boolean', 'label' => 'Transport Cair Saat Izin/Sakit/Cuti (Tetap)', 'group' => 'allowance'],
            ['key' => 'fixed_food_on_leave', 'value' => 'false', 'type' => 'boolean', 'label' => 'Makan Cair Saat Izin/Sakit/Cuti (Tetap)', 'group' => 'allowance'],
            
            // Allowance Rules (Daily/Harian)
            ['key' => 'daily_transport_on_late', 'value' => 'false', 'type' => 'boolean', 'label' => 'Transport Cair Jika Telat (Harian)', 'group' => 'allowance'],
            ['key' => 'daily_food_on_late', 'value' => 'true', 'type' => 'boolean', 'label' => 'Makan Cair Jika Telat (Harian)', 'group' => 'allowance'],
            ['key' => 'daily_transport_on_leave', 'value' => 'false', 'type' => 'boolean', 'label' => 'Transport Cair Saat Izin/Sakit/Cuti (Harian)', 'group' => 'allowance'],
            ['key' => 'daily_food_on_leave', 'value' => 'false', 'type' => 'boolean', 'label' => 'Makan Cair Saat Izin/Sakit/Cuti (Harian)', 'group' => 'allowance'],
        ];

        foreach ($settings as $setting) {
            PayrollSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
