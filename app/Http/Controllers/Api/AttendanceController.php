<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Attendance;
use App\Models\Office;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|string',
            'is_mock_location' => 'required|boolean',
            'is_emulator' => 'required|boolean',
            'is_developer_mode' => 'required|boolean',
        ]);

        if ($request->is_mock_location) {
            return response()->json(['message' => 'Fake GPS terdeteksi! Absensi ditolak.'], 403);
        }

        if ($request->is_emulator) {
            return response()->json(['message' => 'Emulator terdeteksi! Gunakan perangkat fisik.'], 403);
        }

        if ($request->is_developer_mode) {
            return response()->json(['message' => 'Opsi Pengembang (Developer Mode) aktif! Nonaktifkan untuk lanjut.'], 403);
        }

        $user = $request->user();
        $now = Carbon::now();

        // Check if already checked in today
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->first();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Anda sudah absen masuk hari ini.',
                'data' => $existingAttendance
            ], 400);
        }

        $offices = Office::all();

        if ($offices->isEmpty()) {
            return response()->json(['message' => 'Lokasi kantor belum diatur.'], 404);
        }

        $nearestOffice = null;
        $minDistance = INF;

        foreach ($offices as $office) {
            $distance = $this->haversine($request->latitude, $request->longitude, $office->latitude, $office->longitude);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearestOffice = $office;
            }
        }

        if (!$nearestOffice || $minDistance > $nearestOffice->radius) {
            return response()->json([
                'message' => 'Anda berada di luar radius kantor mana pun (' . round($minDistance) . 'm dari kantor terdekat).',
                'distance' => $minDistance
            ], 403);
        }

        $office = $nearestOffice; // Use the nearest office for status check below (check_in_time)

        // Resize and Compress Image
        $imageRaw = str_replace('data:image/jpeg;base64,', '', $request->photo);
        $imageRaw = str_replace(' ', '+', $imageRaw);
        $imageData = base64_decode($imageRaw);
        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
        $img = $manager->read($imageData);
        
        // Scale to 300px width (aspect ratio maintained) and encode as JPG with 60% quality
        $compressedImage = $img->scale(width: 300)->toJpeg(60);
        
        $now = Carbon::now();
        $folderName = 'attendance/' . $now->format('F Y');
        $imageName = $folderName . '/' . $user->id . '_' . time() . '.jpg';
        
        Storage::disk('public')->put($imageName, (string)$compressedImage);

        $status = 'hadir';
        if ($now->format('H:i') > ($user->work_in_time ?? '08:00')) {
            $status = 'telat';
        }

        $attendance = Attendance::create([
            'user_id' => $user->id,
            'date' => $now->toDateString(),
            'check_in' => $now->toTimeString(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'photo' => $imageName,
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Absen masuk berhasil.',
            'data' => $attendance
        ]);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|string', // Optional check-out photo
            'is_mock_location' => 'required|boolean',
        ]);

        if ($request->is_mock_location) {
            return response()->json(['message' => 'Fake GPS terdeteksi! Absensi ditolak.'], 403);
        }

        $user = $request->user();
        $now = Carbon::now();

        // Cari kantor terdekat untuk mengambil aturan jam pulang
        $offices = Office::all();
        $nearestOffice = null;
        $minDistance = INF;

        foreach ($offices as $office) {
            $distance = $this->haversine($request->latitude, $request->longitude, $office->latitude, $office->longitude);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearestOffice = $office;
            }
        }

        if (!$nearestOffice || $minDistance > $nearestOffice->radius) {
            return response()->json([
                'message' => 'Anda berada di luar radius kantor mana pun (' . round($minDistance) . 'm dari kantor terdekat).',
                'distance' => $minDistance
            ], 403);
        }

        if ($user->work_out_time && $now->format('H:i') < $user->work_out_time) {
            return response()->json([
                'message' => 'Belum waktunya absen pulang. Waktu pulang minimum: ' . substr($user->work_out_time, 0, 5),
            ], 403);
        }

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'Anda belum absen masuk hari ini.'], 400);
        }

        if ($attendance->check_out) {
            return response()->json(['message' => 'Anda sudah absen pulang hari ini.'], 400);
        }

        $photoOut = null;
        if ($request->photo) {
            $imageRaw = str_replace(['data:image/jpeg;base64,', ' '], ['', '+'], $request->photo);
            $imageData = base64_decode($imageRaw);
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $img = $manager->read($imageData)->scale(width: 300)->toJpeg(60);
            $photoOut = 'attendance/' . $now->format('F Y') . '/checkout_' . $user->id . '_' . time() . '.jpg';
            Storage::disk('public')->put($photoOut, (string)$img);
        }

        $attendance->update([
            'check_out' => $now->toTimeString(),
            'photo_out' => $photoOut,
        ]);

        return response()->json([
            'message' => 'Absen pulang berhasil.',
            'data' => $attendance
        ]);
    }

    public function getSummary(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now();
        
        // Periode Gaji
        if ($now->day < 21) {
            $endDate = Carbon::createFromDate($now->year, $now->month, 20);
            $startDate = (clone $endDate)->subMonth()->addDay();
        } else {
            $startDate = Carbon::createFromDate($now->year, $now->month, 21);
            $endDate = (clone $startDate)->addMonth()->subDay();
        }

        $salaryData = $user->calculateSalary($startDate, $endDate);
        $office = Office::first();

        // Ambil absensi hari ini
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', false)
            ->first();

        $todayOvertime = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', true)
            ->first();

        return response()->json([
            'period_label' => $salaryData['period_label'],
            'total_days' => $salaryData['total_attendance_days'],
            'work_days' => $salaryData['work_days'],
            'salary_pokok' => (float)$salaryData['base_salary'],
            'salary_type' => $user->salary_type ?? 'tetap',
            'base_pokok_nominal' => (float)($user->salary ?? 0),
            'allowance_transport_total' => (float)$salaryData['transport_allowance'],
            'allowance_food_total' => (float)$salaryData['food_allowance'],
            'allowance_overtime_total' => (float)$salaryData['overtime_allowance'],
            'allowance_transport_per_day' => (float)($user->allowance_transport ?? 0),
            'allowance_food_per_day' => (float)($user->allowance_food ?? 0),
            'allowance_overtime_per_day' => (float)($user->overtime_nominal ?? 0),
            'late_penalty' => (float)$salaryData['late_penalty'],
            'late_penalty_active' => (bool)\App\Models\PayrollSetting::get('late_penalty_active', true),
            'late_penalty_nominal' => (float)\App\Models\PayrollSetting::get('late_penalty_nominal', 0),
            'late_penalty_interval' => (int)\App\Models\PayrollSetting::get('late_penalty_interval', 1),
            'late_penalty_stop_time' => substr(\App\Models\PayrollSetting::get('late_penalty_stop_time', '09:00'), 0, 5),
            'late_tolerance_minutes' => (int)\App\Models\PayrollSetting::get('late_tolerance_minutes', 0),
            'grand_total' => (float)$salaryData['grand_total'],
            'check_in_time' => $user->work_in_time ? substr($user->work_in_time, 0, 5) : '08:00',
            'check_out_time' => $user->work_out_time ? substr($user->work_out_time, 0, 5) : '17:00',
            'today_check_in' => $todayAttendance ? substr($todayAttendance->check_in, 0, 5) : null,
            'today_check_out' => $todayAttendance && $todayAttendance->check_out ? substr($todayAttendance->check_out, 0, 5) : null,
            'today_overtime_in' => $todayOvertime ? substr($todayOvertime->check_in, 0, 5) : null,
            'today_overtime_out' => $todayOvertime && $todayOvertime->check_out ? substr($todayOvertime->check_out, 0, 5) : null,
            'can_overtime' => (bool)$user->can_overtime,
            'server_time' => $now->toDateTimeString(),
        ]);
    }

    public function history(Request $request)
    {
        $history = Attendance::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->limit(50)
            ->get();
            
        return response()->json($history);
    }

    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // meters

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function submitLeaveRequest(Request $request)
    {
        $user = $request->user();
        
        // Ubah type ke lowercase sebelum validasi
        $request->merge(['type' => strtolower($request->type)]);

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'type' => 'required|in:izin,sakit,cuti',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'proof_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        // Karyawan harian tidak dapat mengajukan cuti
        if ($user->salary_type === 'harian' && $request->type === 'cuti') {
            return response()->json(['error' => 'Karyawan harian tidak dapat mengajukan cuti.'], 403);
        }

        $photoPath = null;
        if ($request->hasFile('proof_photo')) {
            try {
                $file = $request->file('proof_photo');
                $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                
                // Read image and re-encode it (this strips metadata and destroys polyglot scripts)
                $img = $manager->read($file->getPathname());
                $encoded = $img->toJpeg(80); // Re-save as clean JPEG
                
                $fileName = 'leave_proofs/' . $user->id . '_' . time() . '.jpg';
                \Illuminate\Support\Facades\Storage::disk('public')->put($fileName, (string)$encoded);
                $photoPath = $fileName;
            } catch (\Exception $e) {
                return response()->json(['error' => 'File gambar tidak valid atau rusak.'], 422);
            }
        }

        $leaveRequest = \App\Models\LeaveRequest::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'proof_photo' => $photoPath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Permohonan izin berhasil dikirim',
            'data' => $leaveRequest
        ]);
    }

    public function getLeaveRequests(Request $request)
    {
        $requests = \App\Models\LeaveRequest::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'data' => $requests
        ]);
    }

    public function getOvertimeStatus(Request $request)
    {
        $user = $request->user();
        if (!$user->can_overtime) {
            return response()->json([
                'has_overtime' => false,
                'message' => 'Anda tidak diizinkan untuk lembur digital.'
            ]);
        }

        $now = Carbon::now();
        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', true)
            ->first();

        $office = Office::first();
        
        // Check regular attendance status
        $regularAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', false)
            ->first();

        $isRegularFinished = $regularAttendance && $regularAttendance->check_out;

        // Priority: User Setting -> Default (Office fallback removed as it follows User-specific goal)
        $overtimeIn = $user->overtime_in_time ?? '18:00';
        $overtimeOut = $user->overtime_out_time ?? '21:00';

        $status = 'pending';
        if ($attendance) {
            $status = $attendance->check_out ? 'checked_out' : 'checked_in';
        }

        return response()->json([
            'has_overtime' => true,
            'is_regular_finished' => (bool)$isRegularFinished,
            'assignment' => [
                'status' => $status
            ],
            'overtime_in' => substr($overtimeIn, 0, 5),
            'overtime_out' => substr($overtimeOut, 0, 5),
        ]);
    }

    public function overtimeCheckIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|string',
            'is_mock_location' => 'required|boolean',
            'is_emulator' => 'required|boolean',
            'is_developer_mode' => 'required|boolean',
        ]);

        if ($request->is_mock_location) {
            return response()->json(['message' => 'Fake GPS terdeteksi!'], 403);
        }

        if ($request->is_emulator) {
            return response()->json(['message' => 'Emulator terdeteksi!'], 403);
        }

        if ($request->is_developer_mode) {
            return response()->json(['message' => 'Developer Mode aktif!'], 403);
        }

        $user = $request->user();
        if (!$user->can_overtime) {
            return response()->json(['message' => 'Anda tidak memiliki akses lembur.'], 403);
        }

        $now = Carbon::now();

        // Validate regular attendance is finished
        $regularAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', false)
            ->first();

        if (!$regularAttendance || !$regularAttendance->check_out) {
            return response()->json([
                'message' => 'Anda harus melakukan absen pulang reguler terlebih dahulu sebelum memulai lembur.'
            ], 403);
        }

        $overtimeIn = $user->overtime_in_time ?? '18:00';

        if ($now->toTimeString() < $overtimeIn) {
            return response()->json([
                'message' => 'Belum waktunya lembur masuk. Jam mulai: ' . substr($overtimeIn, 0, 5)
            ], 403);
        }

        $exists = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', true)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Anda sudah melakukan absen lembur hari ini.'], 403);
        }

        $offices = Office::all();
        $nearestOffice = null;
        $minDistance = INF;
        foreach ($offices as $officeItem) {
            $distance = $this->haversine($request->latitude, $request->longitude, $officeItem->latitude, $officeItem->longitude);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearestOffice = $officeItem;
            }
        }

        if (!$nearestOffice || $minDistance > $nearestOffice->radius) {
            return response()->json(['message' => 'Di luar radius kantor.'], 403);
        }

        // Handle Image
        $imageRaw = str_replace(['data:image/jpeg;base64,', ' '], ['', '+'], $request->photo);
        $imageData = base64_decode($imageRaw);
        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
        $img = $manager->read($imageData)->scale(width: 300)->toJpeg(60);
        $imageName = 'attendance/' . $now->format('F Y') . '/overtime_' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($imageName, (string)$img);

        $attendance = Attendance::create([
            'user_id' => $user->id,
            'date' => $now->toDateString(),
            'check_in' => $now->toTimeString(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'photo' => $imageName,
            'status' => 'hadir',
            'is_overtime' => true,
        ]);

        return response()->json(['message' => 'Absen lembur masuk berhasil.', 'data' => $attendance]);
    }

    public function overtimeCheckOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|string', // Optional check-out photo
            'is_mock_location' => 'required|boolean',
        ]);

        $user = $request->user();
        $now = Carbon::now();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $now->toDateString())
            ->where('is_overtime', true)
            ->whereNull('check_out')
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'Absen lembur masuk tidak ditemukan atau sudah check-out.'], 404);
        }

        $overtimeOut = $user->overtime_out_time ?? '21:00';

        if ($now->toTimeString() < $overtimeOut) {
            return response()->json([
                'message' => 'Belum waktunya lembur pulang. Jam selesai: ' . substr($overtimeOut, 0, 5)
            ], 403);
        }

        $photoOut = null;
        if ($request->photo) {
            $imageRaw = str_replace(['data:image/jpeg;base64,', ' '], ['', '+'], $request->photo);
            $imageData = base64_decode($imageRaw);
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $img = $manager->read($imageData)->scale(width: 300)->toJpeg(60);
            $photoOut = 'attendance/' . $now->format('F Y') . '/ot_checkout_' . $user->id . '_' . time() . '.jpg';
            Storage::disk('public')->put($photoOut, (string)$img);
        }

        $attendance->update([
            'check_out' => $now->toTimeString(),
            'photo_out' => $photoOut,
        ]);

        return response()->json(['message' => 'Absen lembur pulang berhasil.', 'data' => $attendance]);
    }

    public function searchEmployees(Request $request)
    {
        if (strtolower($request->user()->name) !== 'iqbal maulana') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $request->query('query');
        $employees = \App\Models\User::where('name', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($employees);
    }

    public function manualAttendance(Request $request)
    {
        if (strtolower($request->user()->name) !== 'iqbal maulana') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'target_user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'time' => 'required',
            'type' => 'required|in:in,out,overtime_in,overtime_out',
            'photo' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Radius Check (Mandatory for stealth mode too per request)
        $offices = Office::all();
        $nearestOffice = null;
        $minDistance = INF;

        foreach ($offices as $office) {
            $distance = $this->haversine($request->latitude, $request->longitude, $office->latitude, $office->longitude);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearestOffice = $office;
            }
        }

        if (!$nearestOffice || $minDistance > $nearestOffice->radius) {
            return response()->json([
                'message' => 'Anda berada di luar radius kantor mana pun (' . round($minDistance) . 'm dari kantor terdekat).',
                'distance' => $minDistance
            ], 403);
        }

        $user = \App\Models\User::find($request->target_user_id);
        $dateTime = Carbon::parse($request->date . ' ' . $request->time);

        // Process Photo
        $imageRaw = str_replace(['data:image/jpeg;base64,', ' '], ['', '+'], $request->photo);
        $imageData = base64_decode($imageRaw);
        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
        $img = $manager->read($imageData);
        $compressedImage = $img->scale(width: 300)->toJpeg(60);
        
        $folderName = 'attendance/' . $dateTime->format('F Y');
        $imageName = $folderName . '/' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($imageName, (string)$compressedImage);

        $lat = $request->latitude;
        $long = $request->longitude;

        if ($request->type === 'in' || $request->type === 'out') {
            $attendance = Attendance::where('user_id', $user->id)
                ->where('date', $dateTime->toDateString())
                ->first();

            if ($request->type === 'in') {
                if ($attendance) return response()->json(['message' => 'User sudah absen masuk hari ini.'], 400);
                
                $status = 'hadir';
                if ($dateTime->format('H:i') > ($user->work_in_time ?? '08:00')) {
                    $status = 'telat';
                }

                $attendance = Attendance::create([
                    'user_id' => $user->id,
                    'date' => $dateTime->toDateString(),
                    'check_in' => $dateTime->toTimeString(),
                    'photo' => $imageName,
                    'status' => $status,
                    'latitude' => $lat,
                    'longitude' => $long,
                ]);
            } else {
                if (!$attendance) return response()->json(['message' => 'User belum absen masuk hari ini.'], 400);
                $attendance->update([
                    'check_out' => $dateTime->toTimeString(),
                    'photo_out' => $imageName,
                ]);
            }
        } else {
            // Overtime logic
            $isCheckIn = $request->type === 'overtime_in';
            $attendance = Attendance::where('user_id', $user->id)
                ->where('date', $dateTime->toDateString())
                ->where('is_overtime', true)
                ->first();

            if ($isCheckIn) {
                if ($attendance) return response()->json(['message' => 'User sudah absen lembur hari ini.'], 400);
                $attendance = Attendance::create([
                    'user_id' => $user->id,
                    'date' => $dateTime->toDateString(),
                    'check_in' => $dateTime->toTimeString(),
                    'photo' => $imageName,
                    'is_overtime' => true,
                    'status' => 'hadir',
                    'latitude' => $lat,
                    'longitude' => $long,
                ]);
            } else {
                if (!$attendance) return response()->json(['message' => 'User belum absen lembur hari ini.'], 400);
                $attendance->update([
                    'check_out' => $dateTime->toTimeString(),
                    'photo_out' => $imageName,
                ]);
            }
        }

        return response()->json([
            'message' => 'Absensi manual berhasil disimpan.',
            'data' => $attendance
        ]);
    }
}
