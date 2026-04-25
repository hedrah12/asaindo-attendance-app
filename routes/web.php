<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard']);
    Route::get('/employees', [AdminController::class, 'employees']);
    Route::get('/employees/create', [AdminController::class, 'createEmployee']);
    Route::post('/employees', [AdminController::class, 'storeEmployee']);
    Route::get('/employees/{user}/edit', [AdminController::class, 'editEmployee']);
    Route::put('/employees/{user}', [AdminController::class, 'updateEmployee']);
    Route::get('/employees/{user}/attendance', [AdminController::class, 'employeeAttendance']);
    // Offices
        Route::get('/offices', [AdminController::class, 'offices'])->name('offices.index');
        Route::get('/offices/create', [AdminController::class, 'createOffice'])->name('offices.create');
        Route::post('/offices', [AdminController::class, 'storeOffice'])->name('offices.store');
        Route::get('/offices/{office}/edit', [AdminController::class, 'editOffice'])->name('offices.edit');
        Route::post('/offices/{office}', [AdminController::class, 'updateOffice'])->name('offices.update');
        Route::delete('/offices/{office}', [AdminController::class, 'destroyOffice'])->name('offices.destroy');
    // Attendance Manual
    Route::get('/attendance/manual', [AdminController::class, 'manualAttendance']);
    Route::post('/attendance/manual', [AdminController::class, 'storeManualAttendance']);

    Route::get('/reports/export', [AdminController::class, 'exportExcel']);
    Route::get('/reports/salary-pdf', [AdminController::class, 'downloadSalaryReport']);

    // Leave & Overtime
    Route::get('/leaves', [AdminController::class, 'leaveRequests'])->name('leaves.index');
    Route::post('/leaves/{leaveRequest}/approve', [AdminController::class, 'approveLeave'])->name('leaves.approve');
    Route::post('/leaves/{leaveRequest}/reject', [AdminController::class, 'rejectLeave'])->name('leaves.reject');
    
    Route::post('/attendance/{attendance}/toggle-overtime', [AdminController::class, 'toggleOvertime']);

    // Payroll Settings
    Route::get('/settings/payroll', [\App\Http\Controllers\Admin\PayrollSettingController::class, 'index'])->name('settings.payroll');
    Route::post('/settings/payroll', [\App\Http\Controllers\Admin\PayrollSettingController::class, 'update'])->name('settings.payroll.update');
});
