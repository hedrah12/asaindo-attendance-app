<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Attendance;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CleanupAttendancePhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-attendance-photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete attendance photos older than 30 days and nullify database records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $thresholdDate = Carbon::now()->subDays(30);

        $this->info('Starting photo cleanup for records older than ' . $thresholdDate->toDateString());

        $attendances = Attendance::where('date', '<', $thresholdDate->toDateString())
            ->where(function ($query) {
                $query->whereNotNull('photo')
                      ->orWhereNotNull('photo_out');
            })
            ->get();

        $count = 0;
        foreach ($attendances as $attendance) {
            if ($attendance->photo) {
                if (Storage::disk('public')->exists($attendance->photo)) {
                    Storage::disk('public')->delete($attendance->photo);
                }
                $attendance->photo = null;
            }

            if ($attendance->photo_out) {
                if (Storage::disk('public')->exists($attendance->photo_out)) {
                    Storage::disk('public')->delete($attendance->photo_out);
                }
                $attendance->photo_out = null;
            }

            $attendance->save();
            $count++;
        }

        $this->info("Successfully cleaned up photos for {$count} attendance records.");
    }
}
