<?php

namespace App\Exports;

use App\Models\Attendance;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AttendanceExport implements FromArray, WithHeadings
{
    protected $startDate;
    protected $endDate;
    protected $type;

    public function __construct($startDate, $endDate, $type = 'attendance')
    {
        Carbon::setLocale('id'); // Ensure Indonesian date formatting
        $this->startDate = Carbon::parse($startDate);
        $this->endDate = Carbon::parse($endDate);
        $this->type = $type;
    }

    public function array(): array
    {
        $query = User::whereNot('email', 'admin@gmail.com');
        
        if ($this->type === 'overtime') {
            $query->where('can_overtime', true);
        }

        $employees = $query->get();
        $period = CarbonPeriod::create($this->startDate, $this->endDate);
        $data = [];

        foreach ($employees as $employee) {
            $row = [$employee->name];
            
            // Get all attendances for this employee in the period
            $attendances = Attendance::where('user_id', $employee->id)
                ->whereBetween('date', [$this->startDate->toDateString(), $this->endDate->toDateString()])
                ->get()
                ->groupBy('date');

            $totalDays = 0;

            foreach ($period as $date) {
                $dateStr = $date->toDateString();
                $attendance = $attendances->get($dateStr);
                
                $cellValue = '';
                if ($this->type === 'attendance') {
                    $regAtt = $attendance?->firstWhere('is_overtime', false);
                    if ($regAtt) {
                        if (in_array($regAtt->status, ['hadir', 'telat'])) {
                            $in = $regAtt->check_in ? substr($regAtt->check_in, 0, 5) : '--:--';
                            $out = $regAtt->check_out ? substr($regAtt->check_out, 0, 5) : '--:--';
                            $cellValue = "{$in} - {$out}";
                            $totalDays++;
                        } else {
                            $cellValue = ucfirst($regAtt->status);
                            if (in_array($regAtt->status, ['izin', 'sakit', 'cuti'])) {
                                $totalDays++;
                            }
                        }
                    }
                } else {
                    $otAtt = $attendance?->firstWhere('is_overtime', true);
                    if ($otAtt) {
                        $in = $otAtt->check_in ? substr($otAtt->check_in, 0, 5) : '--:--';
                        $out = $otAtt->check_out ? substr($otAtt->check_out, 0, 5) : '--:--';
                        $cellValue = "{$in} - {$out}";
                        $totalDays++;
                    }
                }
                $row[] = $cellValue;
            }

            if ($this->type === 'attendance') {
                $salary = $employee->calculateSalary($this->startDate, $this->endDate);
                $row[] = (int)$salary['work_days'];
                $row[] = (int)$salary['transport_allowance'];
                $row[] = (int)$salary['food_allowance'];
                $row[] = (int)$salary['base_salary'];
                $row[] = (int)$salary['late_penalty'];
                $row[] = (int)$salary['grand_total'];
            } else {
                $salary = $employee->calculateSalary($this->startDate, $this->endDate);
                $row[] = (int)$salary['overtime_days'];
                $row[] = (int)$salary['overtime_allowance'];
            }

            $data[] = $row;
        }

        return $data;
    }

    public function headings(): array
    {
        $headings = ['Nama'];
        $period = CarbonPeriod::create($this->startDate, $this->endDate);
        
        foreach ($period as $date) {
            // Format: 1 Maret 2026 (Bahasa Indonesia)
            $headings[] = $date->translatedFormat('j F Y');
        }

        if ($this->type === 'attendance') {
            $headings = array_merge($headings, [
                'Total Hari',
                'Transport',
                'Makan',
                'Gaji Pokok',
                'Potongan',
                'Total'
            ]);
        } else {
            $headings = array_merge($headings, [
                'Total Hari Lembur',
                'Total Bayaran Lembur'
            ]);
        }

        return $headings;
    }
}
