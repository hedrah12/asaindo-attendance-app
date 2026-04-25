<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupOldPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:cleanup-photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghapus file foto absensi yang sudah lebih dari 30 hari untuk menghemat ruang penyimpanan.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $oneMonthAgo = \Carbon\Carbon::now()->subDays(30)->toDateString();
        
        $attendances = \App\Models\Attendance::where('date', '<', $oneMonthAgo)
            ->whereNotNull('photo')
            ->get();

        $count = 0;
        foreach ($attendances as $attendance) {
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($attendance->photo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($attendance->photo);
            }
            
            $attendance->update(['photo' => null]);
            $count++;
        }

        $this->info("Berhasil membersihkan {$count} foto absensi lama.");
    }
}
