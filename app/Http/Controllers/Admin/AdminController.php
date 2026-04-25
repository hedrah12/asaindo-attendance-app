<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Office;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\NotificationService;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $month = $request->get('month', date('m'));
        $year = $request->get('year', date('Y'));

        $endDate = \Carbon\Carbon::createFromDate($year, $month, 20);
        $startDate = (clone $endDate)->subMonth()->addDay();

        $stats = [
            'total_employees' => User::whereNot('email', 'admin@gmail.com')->count(),
            'present_today' => Attendance::where('date', date('Y-m-d'))->whereIn('status', ['hadir', 'telat'])->count(),
            'late_today' => Attendance::where('date', date('Y-m-d'))->where('status', 'telat')->count(),
            'excused_today' => Attendance::where('date', date('Y-m-d'))->whereIn('status', ['izin', 'sakit', 'cuti'])->count(),
        ];

        $recent_attendances = Attendance::with(['user' => function ($query) {
            $query->withTrashed();
        }])->orderBy('created_at', 'desc')->take(10)->get();

        $users = User::whereNot('email', 'admin@gmail.com')->withTrashed()->get();
        $employee_summaries = $users->map(function($user) use ($startDate, $endDate) {
            $salaryData = $user->calculateSalary($startDate, $endDate);
            
            // Add some raw attributes for the frontend to match previous structure if needed, 
            // but primarily provide the calculated totals.
            $user->total_days = $salaryData['total_attendance_days'];
            $user->work_days = $salaryData['work_days'];
            $user->salary_summary = $salaryData;
            
            // Replicate the latest_attendance check for today
            $latest = Attendance::where('user_id', $user->id)
                ->where('date', date('Y-m-d'))
                ->first();
                
            $user->latest_attendance_id = $latest?->id;
            $user->is_overtime = $latest?->is_overtime ?? false;
            
            return $user;
        });

        return \Inertia\Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_attendances' => $recent_attendances,
            'employee_summaries' => $employee_summaries,
            'month' => date('F', mktime(0, 0, 0, $month, 1)),
            'month_numeric' => (int)$month,
            'year' => (int)$year,
        ]);
    }

    public function downloadSalaryReport(Request $request)
    {
        $month = $request->get('month', date('m'));
        $year = $request->get('year', date('Y'));

        $endDate = \Carbon\Carbon::createFromDate($year, $month, 20);
        $startDate = (clone $endDate)->subMonth()->addDay();

        $employees = User::whereNot('email', 'admin@gmail.com')
            ->withCount(['attendances as total_days' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->whereIn('status', ['hadir', 'telat', 'izin', 'sakit']);
        }])
            ->withCount(['attendances as work_days' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->whereIn('status', ['hadir', 'telat']);
        }])
            ->get();

        $pdf = Pdf::loadView('admin.reports.salary_pdf', [
            'employees' => $employees,
            'month' => $month,
            'year' => $year,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);

        return $pdf->download("laporan_gaji_{$month}_{$year}.pdf");
    }

    public function employees(Request $request)
    {
        $search = $request->get('search');
        
        $employees = User::whereNot('email', 'admin@gmail.com')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->with('roles')
            ->get();

        return \Inertia\Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'filters' => ['search' => $search]
        ]);
    }

    public function createEmployee()
    {
        return \Inertia\Inertia::render('Admin/Employees/Create');
    }

    public function storeEmployee(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'salary' => 'nullable|numeric',
            'allowance_transport' => 'nullable|numeric',
            'allowance_food' => 'nullable|numeric',
            'salary_type' => 'required|in:tetap,harian',
            'photo' => 'nullable|image|max:2048',
            'work_in_time' => 'required',
            'work_out_time' => 'required',
            'overtime_in_time' => 'nullable',
            'overtime_out_time' => 'nullable',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('profile_photos', 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'salary' => $request->salary,
            'allowance_transport' => $request->allowance_transport,
            'allowance_food' => $request->allowance_food,
            'salary_type' => $request->salary_type,
            'photo' => $photoPath,
            'work_in_time' => $request->work_in_time,
            'work_out_time' => $request->work_out_time,
            'can_overtime' => $request->has('can_overtime'),
            'overtime_nominal' => $request->overtime_nominal ?? 0,
            'overtime_in_time' => $request->overtime_in_time,
            'overtime_out_time' => $request->overtime_out_time,
        ])->assignRole('karyawan');

        return redirect(url('admin/employees'))->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function destroyEmployee(User $user)
    {
        $user->delete();
        return back()->with('success', 'Karyawan berhasil dihapus.');
    }

    public function offices()
    {
        $offices = Office::all();
        return \Inertia\Inertia::render('Admin/Offices/Index', [
            'offices' => $offices
        ]);
    }

    public function createOffice()
    {
        return \Inertia\Inertia::render('Admin/Offices/Create');
    }

    public function storeOffice(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
        ]);

        Office::create($request->all());

        return redirect(url('admin/offices'))->with('success', 'Lokasi kantor berhasil ditambah.');
    }

    public function editOffice(Office $office)
    {
        return \Inertia\Inertia::render('Admin/Offices/Edit', [
            'office' => $office
        ]);
    }

    public function updateOffice(Request $request, Office $office)
    {
        $request->validate([
            'name' => 'required',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
        ]);

        $office->update($request->all());

        return redirect(url('admin/offices'))->with('success', 'Lokasi kantor berhasil diupdate.');
    }

    public function destroyOffice(Office $office)
    {
        $office->delete();
        return redirect(url('admin/offices'))->with('success', 'Lokasi kantor berhasil dihapus.');
    }

    public function exportExcel(Request $request)
    {
        $month = $request->get('month', date('m'));
        $year = $request->get('year', date('Y'));
        $type = $request->get('type', 'attendance');

        if ($type === 'overtime') {
            $startDate = \Carbon\Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $endDate = (clone $startDate)->endOfMonth();
            $filenamePrefix = "rekap_lembur";
        } else {
            $endDate = \Carbon\Carbon::createFromDate($year, $month, 20);
            $startDate = (clone $endDate)->subMonth()->addDay();
            $filenamePrefix = "rekap_absensi";
        }

        return Excel::download(
            new \App\Exports\AttendanceExport($startDate->toDateString(), $endDate->toDateString(), $type),
            "{$filenamePrefix}_{$startDate->format('Ymd')}_{$endDate->format('Ymd')}.xlsx"
        );
    }

    public function manualAttendance()
    {
        $users = User::whereNot('email', 'admin@gmail.com')->get();
        return \Inertia\Inertia::render('Admin/Attendance/Manual', [
            'users' => $users
        ]);
    }

    public function storeManualAttendance(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'check_in' => 'required',
            'check_out' => 'nullable',
            'status' => 'required|in:hadir,telat,izin,sakit,cuti',
            'note' => 'nullable|string',
        ]);

        Attendance::updateOrCreate(
        ['user_id' => $request->user_id, 'date' => $request->date],
        [
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'status' => $request->status,
            'note' => $request->note,
            'latitude' => null, // Manual attendance doesn't have GPS
            'longitude' => null,
            'photo' => null,
        ]
        );

        return redirect(url('admin'))->with('success', 'Absensi manual berhasil disimpan.');
    }

    public function employeeAttendance(Request $request, User $user)
    {
        $month = $request->get('month', date('m'));
        $year = $request->get('year', date('Y'));

        $endDate = \Carbon\Carbon::createFromDate($year, $month, 20);
        $startDate = (clone $endDate)->subMonth()->addDay();

        $salaryData = $user->calculateSalary($startDate, $endDate);
        
        $attendances = Attendance::where('user_id', $user->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date', 'desc')
            ->get()
            ->groupBy('date')
            ->map(function ($dayAttendances) {
                $regular = $dayAttendances->where('is_overtime', false)->first();
                $overtime = $dayAttendances->where('is_overtime', true)->first();
                
                return [
                    'date' => $dayAttendances->first()->date,
                    'regular' => $regular,
                    'overtime' => $overtime,
                    // Use regular status as primary, fallback to overtime if only that exists
                    'status' => $regular ? $regular->status : ($overtime ? $overtime->status : 'tap'),
                ];
            })->values();

        return \Inertia\Inertia::render('Admin/Employees/AttendanceDetail', [
            'employee' => $user,
            'attendances' => $attendances,
            'salary_summary' => $salaryData,
            'month' => (int)$month,
            'year' => (int)$year,
        ]);
    }

    public function editEmployee(User $user)
    {
        return \Inertia\Inertia::render('Admin/Employees/Edit', [
            'employee' => $user
        ]);
    }

    public function updateEmployee(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'salary' => 'nullable|numeric',
            'allowance_transport' => 'nullable|numeric',
            'allowance_food' => 'nullable|numeric',
            'salary_type' => 'required|in:tetap,harian',
            'photo' => 'nullable|image|max:2048',
            'work_in_time' => 'required',
            'work_out_time' => 'required',
            'overtime_in_time' => 'nullable',
            'overtime_out_time' => 'nullable',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'salary' => $request->salary,
            'allowance_transport' => $request->allowance_transport,
            'allowance_food' => $request->allowance_food,
            'salary_type' => $request->salary_type,
            'work_in_time' => $request->work_in_time,
            'work_out_time' => $request->work_out_time,
            'can_overtime' => $request->has('can_overtime'),
            'overtime_nominal' => $request->overtime_nominal ?? 0,
            'overtime_in_time' => $request->overtime_in_time,
            'overtime_out_time' => $request->overtime_out_time,
        ];

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->photo);
            }
            $data['photo'] = $request->file('photo')->store('profile_photos', 'public');
        }

        $user->update($data);

        return redirect(url('admin/employees'))->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function leaveRequests()
    {
        $requests = \App\Models\LeaveRequest::with('user')->orderBy('created_at', 'desc')->get();
        return \Inertia\Inertia::render('Admin/Leaves/Index', [
            'leaveRequests' => $requests
        ]);
    }

    public function approveLeave(\App\Models\LeaveRequest $leaveRequest)
    {
        $leaveRequest->update(['status' => 'approved']);

        // Auto-create attendance record for each day in range
        $start = \Carbon\Carbon::parse($leaveRequest->start_date ?? $leaveRequest->date);
        $end = \Carbon\Carbon::parse($leaveRequest->end_date ?? ($leaveRequest->date ?? $leaveRequest->start_date));
        
        $current = $start->copy();
        while ($current <= $end) {
            \App\Models\Attendance::updateOrCreate(
                ['user_id' => $leaveRequest->user_id, 'date' => $current->toDateString()],
                [
                    'status' => $leaveRequest->type,
                    'check_in' => $leaveRequest->user->work_in_time ?? '08:00',
                    'check_out' => $leaveRequest->user->work_out_time ?? '17:00',
                    'is_overtime' => false,
                ]
            );
            $current->addDay();
        }

        if ($leaveRequest->user->push_token) {
            $rangeText = $leaveRequest->start_date === $leaveRequest->end_date 
                ? $leaveRequest->start_date 
                : "{$leaveRequest->start_date} s/d {$leaveRequest->end_date}";

            \App\Services\NotificationService::sendPushNotification(
                $leaveRequest->user->push_token,
                'Pengajuan Izin Disetujui',
                "Pengajuan {$leaveRequest->type} Anda untuk tanggal {$rangeText} telah disetujui."
            );
        }

        return back()->with('success', 'Permohonan izin disetujui.');
    }

    public function rejectLeave(\App\Models\LeaveRequest $leaveRequest)
    {
        $leaveRequest->update(['status' => 'rejected']);

        if ($leaveRequest->user->push_token) {
            $rangeText = $leaveRequest->start_date === $leaveRequest->end_date 
                ? $leaveRequest->start_date 
                : "{$leaveRequest->start_date} s/d {$leaveRequest->end_date}";

            \App\Services\NotificationService::sendPushNotification(
                $leaveRequest->user->push_token,
                'Pengajuan Izin Ditolak',
                "Mohon maaf, pengajuan {$leaveRequest->type} Anda untuk tanggal {$rangeText} ditolak."
            );
        }

        return back()->with('success', 'Permohonan izin ditolak.');
    }

    public function toggleOvertime(Attendance $attendance)
    {
        $attendance->update([
            'is_overtime' => !$attendance->is_overtime
        ]);

        return back()->with('success', 'Status lembur diperbarui.');
    }
}
