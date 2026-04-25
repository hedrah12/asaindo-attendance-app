<!DOCTYPE html>
<html>
<head>
    <title>Laporan Gaji Karyawan - {{ $month }}/{{ $year }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #6366f1; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #666; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; text-align: left; color: #64748b; text-transform: uppercase; font-size: 10px; }
        td { border: 1px solid #e2e8f0; padding: 10px; vertical-align: top; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .footer { margin-top: 50px; text-align: right; }
        .currency { float: left; }
        .total-row { background: #eff6ff; font-weight: bold; }
        .period { margin-bottom: 20px; font-style: italic; color: #475569; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ASAINDO ABSENSI</h1>
        <p>LAPORAN PENGGAJIAN KARYAWAN</p>
    </div>

    <div class="period">
        Periode: {{ $startDate->format('d M Y') }} - {{ $endDate->format('d M Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Nama Karyawan</th>
                <th>Tipe</th>
                <th>Kehadiran</th>
                <th>Gaji Pokok</th>
                <th>Tunjangan</th>
                <th>Lembur</th>
                <th>Potongan</th>
                <th>Grand Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($employees as $employee)
                @php
                    $salary = $employee->calculateSalary($startDate, $endDate);
                @endphp
                <tr>
                    <td>
                        <div class="font-bold">{{ $employee->name }}</div>
                        <div style="font-size: 10px; color: #94a3b8;">{{ $employee->email }}</div>
                    </td>
                    <td>{{ strtoupper($employee->salary_type) }}</td>
                    <td>
                        <div>Masuk: {{ $salary['work_days'] }} hr</div>
                        <div style="font-size: 10px;">Total: {{ $salary['total_attendance_days'] }} hr</div>
                    </td>
                    <td class="text-right">
                        Rp {{ number_format($salary['base_salary'], 0, ',', '.') }}
                    </td>
                    <td class="text-right">
                        <div style="font-size: 10px;">T: {{ number_format($salary['transport_allowance'], 0, ',', '.') }}</div>
                        <div style="font-size: 10px;">M: {{ number_format($salary['food_allowance'], 0, ',', '.') }}</div>
                    </td>
                    <td class="text-right">
                        Rp {{ number_format($salary['overtime_allowance'], 0, ',', '.') }}
                    </td>
                    <td class="text-right" style="color: #e11d48;">
                        - Rp {{ number_format($salary['late_penalty'], 0, ',', '.') }}
                    </td>
                    <td class="text-right total-row">
                        Rp {{ number_format($salary['grand_total'], 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ date('d/m/Y H:i') }}</p>
        <br><br><br>
        <p>__________________________</p>
        <p>Admin HRD</p>
    </div>
</body>
</html>
