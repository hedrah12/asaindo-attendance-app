<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Office;
use App\Models\Attendance;
use App\Services\NotificationService;
use Carbon\Carbon;

class SendAttendanceReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:reminders';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Send push notification reminders for attendance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $currentTime = $now->format('H:i');
        $today = $now->toDateString();

        $offices = Office::all();
        $users = User::whereNotNull('push_token')->get();

        foreach ($users as $user) {
            foreach ($offices as $office) {
                // Check In Reminder (15 mins before)
                $checkInTime = Carbon::createFromFormat('H:i', $office->check_in_time);
                $reminderInStart = (clone $checkInTime)->subMinutes(15)->format('H:i');
                
                if ($currentTime === $reminderInStart) {
                    // Check if already checked in
                    $exists = Attendance::where('user_id', $user->id)
                        ->where('date', $today)
                        ->whereNotNull('check_in')
                        ->where('is_overtime', false)
                        ->exists();

                    if (!$exists) {
                        NotificationService::sendPushNotification(
                            $user->push_token,
                            'Waktunya Absen Masuk',
                            "Sudah hampir jam {$office->check_in_time}. Jangan lupa absen masuk di {$office->name} ya!"
                        );
                    }
                }

                // Check Out Reminder (at check out time)
                if ($currentTime === $office->check_out_time) {
                    $exists = Attendance::where('user_id', $user->id)
                        ->where('date', $today)
                        ->whereNotNull('check_in')
                        ->whereNull('check_out')
                        ->where('is_overtime', false)
                        ->exists();

                    if ($exists) {
                        NotificationService::sendPushNotification(
                            $user->push_token,
                            'Waktunya Absen Pulang',
                            "Jam kerja sudah selesai. Jangan lupa absen pulang ya!"
                        );
                    }
                }

                // Overtime Reminder (if applicable)
                if ($user->can_overtime && $office->overtime_in_time) {
                    $otInTime = Carbon::createFromFormat('H:i', $office->overtime_in_time);
                    $reminderOtIn = (clone $otInTime)->subMinutes(5)->format('H:i');

                    if ($currentTime === $reminderOtIn) {
                        $exists = Attendance::where('user_id', $user->id)
                            ->where('date', $today)
                            ->whereNotNull('check_in')
                            ->where('is_overtime', true)
                            ->exists();

                        if (!$exists) {
                            NotificationService::sendPushNotification(
                                $user->push_token,
                                'Waktunya Absen Lembur',
                                "Sudah hampir jam {$office->overtime_in_time}. Siap untuk lembur? Jangan lupa absen ya!"
                            );
                        }
                    }
                }
            }
        }

        $this->info('Attendance reminders sent successfully.');
    }
}
