<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'device_id',
        'push_token',
        'salary',
        'allowance_transport',
        'allowance_food',
        'salary_type',
        'photo',
        'work_in_time',
        'work_out_time',
        'can_overtime',
        'overtime_nominal',
        'overtime_in_time',
        'overtime_out_time',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'salary' => 'integer',
            'allowance_transport' => 'integer',
            'allowance_food' => 'integer',
            'overtime_nominal' => 'integer',
            'can_overtime' => 'boolean',
        ];
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Calculate salary for a given period.
     */
    public function calculateSalary($startDate, $endDate)
    {
        $attendances = $this->attendances()
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->where('is_overtime', false)
            ->get();

        $isHarian = $this->salary_type === 'harian';
        $prefix = $isHarian ? 'daily_' : 'fixed_';

        // Load Settings
        $latePenaltyActive = \App\Models\PayrollSetting::get('late_penalty_active', true);
        $latePenaltyNominal = \App\Models\PayrollSetting::get('late_penalty_nominal', 0);
        $latePenaltyInterval = \App\Models\PayrollSetting::get('late_penalty_interval', 1);
        $latePenaltyStopTime = \App\Models\PayrollSetting::get('late_penalty_stop_time', '09:00');
        $lateTolerance = \App\Models\PayrollSetting::get('late_tolerance_minutes', 0);
        
        $transportOnLate = \App\Models\PayrollSetting::get($prefix . 'transport_on_late', false);
        $foodOnLate = \App\Models\PayrollSetting::get($prefix . 'food_on_late', false);
        $transportOnLeave = \App\Models\PayrollSetting::get($prefix . 'transport_on_leave', false);
        $foodOnLeave = \App\Models\PayrollSetting::get($prefix . 'food_on_leave', false);

        $totalLatePenalty = 0;
        $workDays = 0;
        $paidDays = 0;
        $transportDays = 0;
        $foodDays = 0;

        foreach ($attendances as $attendance) {
            $status = $attendance->status;

            if (in_array($status, ['hadir', 'telat'])) {
                $workDays++;
                $paidDays++;

                // Calculate Late Penalty
                if ($latePenaltyActive && $status === 'telat' && $attendance->check_in) {
                    $workInTime = \Carbon\Carbon::parse($this->work_in_time ?? '08:00');
                    $checkInTime = \Carbon\Carbon::parse($attendance->check_in);
                    
                    // Stop time logic: if check in is after stop time, calculation uses stop time
                    $stopTime = \Carbon\Carbon::parse($attendance->date . ' ' . $latePenaltyStopTime);
                    $effectiveCheckIn = $checkInTime->greaterThan($stopTime) ? $stopTime : $checkInTime;

                    $diffInMinutes = $effectiveCheckIn->diffInMinutes($workInTime, false);
                    
                    if ($diffInMinutes < 0) { 
                        $penaltyMinutes = abs($diffInMinutes) - $lateTolerance;
                        if ($penaltyMinutes > 0) {
                            // Logic: Every interval (or part of it) gets charged the nominal amount
                            $multiplier = ceil($penaltyMinutes / $latePenaltyInterval);
                            $totalLatePenalty += ($multiplier * $latePenaltyNominal);
                        }
                    }

                    // Tunjangan saat telat
                    if ($transportOnLate) $transportDays++;
                    if ($foodOnLate) $foodDays++;
                } else {
                    // Tepat waktu (Hadir)
                    $transportDays++;
                    $foodDays++;
                }
            } elseif (in_array($status, ['izin', 'sakit', 'cuti'])) {
                // Check if this specific leave status is paid for this salary type
                $isPaid = \App\Models\PayrollSetting::get($prefix . 'paid_' . $status, false);
                if ($isPaid) {
                    $paidDays++;
                }

                // Tunjangan saat izin/sakit/cuti
                if ($transportOnLeave) $transportDays++;
                if ($foodOnLeave) $foodDays++;
            }
        }

        $baseSalary = $this->salary * $paidDays;
        $transport = ($this->allowance_transport ?? 0) * $transportDays;
        $makan = ($this->allowance_food ?? 0) * $foodDays;

        // Lembur (Overtime)
        $overtimeDays = $this->attendances()
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->where('is_overtime', true)
            ->count();
        $overtimeTotal = ($this->overtime_nominal ?? 0) * $overtimeDays;

        $grandTotal = ($baseSalary + $transport + $makan + $overtimeTotal) - $totalLatePenalty;

        return [
            'period_label' => $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y'),
            'total_attendance_days' => (int)$paidDays,
            'work_days' => (int)$workDays,
            'overtime_days' => (int)$overtimeDays,
            'base_salary' => (int)$baseSalary,
            'transport_allowance' => (int)$transport,
            'food_allowance' => (int)$makan,
            'overtime_allowance' => (int)$overtimeTotal,
            'late_penalty' => (int)$totalLatePenalty,
            'grand_total' => (int)max(0, $grandTotal),
        ];
    }
}
