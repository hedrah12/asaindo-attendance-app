<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('attendance:reminders')->everyMinute();
Schedule::command('app:cleanup-attendance-photos')->daily();

Schedule::call(function () {
    \App\Models\User::query()->update(['device_id' => null]);
})->dailyAt('00:00')->name('reset-device-id');
