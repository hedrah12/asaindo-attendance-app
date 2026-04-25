<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AttendanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/update-push-token', [AuthController::class, 'updatePushToken']);
    
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('/attendance/history', [AttendanceController::class, 'history']);
    Route::get('/attendance/summary', [AttendanceController::class, 'getSummary']);

    // Leave Requests
    Route::post('/leave-requests', [AttendanceController::class, 'submitLeaveRequest']);
    Route::get('/leave-requests', [AttendanceController::class, 'getLeaveRequests']);

    // Overtime
    Route::get('/overtime/status', [AttendanceController::class, 'getOvertimeStatus']);
    Route::post('/overtime/check-in', [AttendanceController::class, 'overtimeCheckIn']);
    Route::get('/overtime/check-out', [AttendanceController::class, 'overtimeCheckOut']);

    // Super Manual (Restricted)
    Route::get('/employees/search', [AttendanceController::class, 'searchEmployees']);
    Route::post('/attendance/manual', [AttendanceController::class, 'manualAttendance']);
});
