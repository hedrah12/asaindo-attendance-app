import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Activity,
    FileText,
    TrendingUp,
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button
} from '@/Components/ui';
import { Select } from '@/Components/ui/Forms';
import { cn } from '@/Components/ui';

export default function AttendanceDetail({ employee, attendances, salary_summary, month, year }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const handleFilterChange = (type, value) => {
        const params = {
            month: type === 'month' ? value : month,
            year: type === 'year' ? value : year,
        };
        router.get(`\${basePath}/admin/employees/${employee.id}/attendance`, params, { preserveState: true });
    };

    const months = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const stats = [
        { label: 'HARI KERJA', value: salary_summary.work_days, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'TOTAL HADIR', value: salary_summary.total_attendance_days, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'HARI LEMBUR', value: salary_summary.overtime_days, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <AdminLayout>
            <Head title={`Laporan Kehadiran: ${employee.name}`} />

            <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href={`\${basePath}/admin`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider mb-1.5 text-indigo-600 shadow-sm">
                                <FileText size={12} className="fill-indigo-600/20" />
                                LAPORAN INDIVIDUAL
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Kehadiran: <span className="text-indigo-600 italic">{employee.name}.</span></h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Periode Bulan</p>
                            <Select
                                value={month}
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="h-10 min-w-[140px] bg-white border-slate-200 text-slate-700 text-[12px] font-bold uppercase rounded-xl focus:ring-indigo-500/10 shadow-sm"
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Tahun</p>
                            <Select
                                value={year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="h-10 min-w-[100px] bg-white border-slate-200 text-slate-700 text-[12px] font-bold uppercase rounded-xl focus:ring-indigo-500/10 shadow-sm"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110", stat.bg, stat.color, stat.bg.replace('bg-', 'border-'))}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="text-[10px] font-black text-slate-200 tracking-widest uppercase">STAT-0{i + 1}</div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value} <span className="text-sm font-bold text-slate-300 ml-1">HARI</span></h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content: Payroll & Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payroll Summary Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border border-slate-900 bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl sticky top-8">
                            <div className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest leading-none">ESTIMASI PAYROLL</p>
                                        <h4 className="text-xl font-bold tracking-tight">Perhitungan Gaji.</h4>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 backdrop-blur-sm border border-white/5">
                                        <Activity size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gaji Pokok</p>
                                        <p className="text-sm font-bold">Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(salary_summary.base_salary || 0))}</p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tunjangan</p>
                                        <p className="text-sm font-bold">Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round((salary_summary.transport_allowance || 0) + (salary_summary.food_allowance || 0)))}</p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lembur</p>
                                        <p className="text-sm font-bold">Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(salary_summary.overtime_allowance || 0))}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-0 mt-4">
                                <div className="p-6 bg-indigo-600 rounded-2xl shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                                    <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-1 relative z-10">TOTAL ESTIMASI</p>
                                    <h3 className="text-2xl font-black text-white tracking-tight relative z-10">
                                        Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(salary_summary.grand_total || 0))}
                                    </h3>
                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                                        <p className="text-[8px] font-bold text-indigo-200 uppercase tracking-tighter italic">Periode: {salary_summary.period_label}</p>
                                        <CheckCircle2 size={12} className="text-white opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Attendance Log */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Log Kehadiran Harian</CardTitle>
                                    <p className="text-xs text-slate-400 font-medium">Data absen dan lembur secara mendetail.</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4">TANGGAL</th>
                                                <th className="px-6 py-4">REGULER (IN/OUT)</th>
                                                <th className="px-6 py-4">LEMBUR (IN/OUT)</th>
                                                <th className="px-6 py-4 text-center">FOTO (IN/OUT)</th>
                                                <th className="px-6 py-4 text-right">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {attendances.map((day, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-100 transition-colors">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{new Date(day.date).toLocaleString('id-ID', { month: 'short' })}</p>
                                                                <p className="text-lg font-black text-slate-900 leading-none mt-0.5">{new Date(day.date).getDate()}</p>
                                                            </div>
                                                            <div className="hidden sm:block">
                                                                <p className="text-[12px] font-bold text-slate-900 leading-tight">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{day.date}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {day.regular ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                                    <p className="text-[13px] font-bold text-slate-700">{day.regular.check_in?.slice(0, 5) || '--:--'}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                                    <p className="text-[13px] font-bold text-slate-700">{day.regular.check_out?.slice(0, 5) || '--:--'}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-slate-300 italic">Tidak ada absen reguler</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {day.overtime ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                                    <p className="text-[13px] font-bold text-slate-700">{day.overtime.check_in?.slice(0, 5) || '--:--'}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                                    <p className="text-[13px] font-bold text-slate-700">{day.overtime.check_out?.slice(0, 5) || '--:--'}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-slate-300 italic">Tidak ada lembur</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {/* Showing only Regular in/out for simplicity or the primary record */}
                                                            {day.regular?.photo ? (
                                                                <div className="group/img relative">
                                                                    <img
                                                                        src={`/storage/${day.regular.photo}`}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm group-hover/img:scale-150 group-hover/img:z-10 transition-transform cursor-zoom-in"
                                                                        alt="In"
                                                                        title="Foto Masuk"
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-300">IN</div>
                                                            )}
                                                            {day.regular?.photo_out ? (
                                                                <div className="group/img relative">
                                                                    <img
                                                                        src={`/storage/${day.regular.photo_out}`}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm group-hover/img:scale-150 group-hover/img:z-10 transition-transform cursor-zoom-in"
                                                                        alt="Out"
                                                                        title="Foto Pulang"
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 bg-red-400 w-3 h-3 rounded-full border-2 border-white"></div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-300">OUT</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <span className={cn(
                                                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-xs",
                                                            day.status === 'hadir' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                day.status === 'telat' || day.status === 'telat_pulang' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                    "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                        )}>
                                                            {day.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {attendances.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-12 text-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                                            <AlertCircle size={32} />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-400 italic">Tidak ada data kehadiran untuk periode ini.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
