import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    UserMinus,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Download,
    Filter,
    CalendarClock,
    FileText,
    ArrowRight,
    Activity,
    Clock,
    Zap,
    MapPin
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button
} from '@/Components/ui';
import { Select, Label } from '@/Components/ui/Forms';
import { cn } from '@/Components/ui';

export default function Dashboard({ stats, recent_attendances, employee_summaries, month, month_numeric, year }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const handleFilterChange = (type, value) => {
        const params = {
            month: type === 'month' ? value : month_numeric,
            year: type === 'year' ? value : year,
        };
        router.get(`\${basePath}/admin`, params, { preserveState: true });
    };

    const handleExport = (type) => {
        window.location.href = `\${basePath}/admin/reports/export?month=${month_numeric}&year=${year}&type=${type}`;
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
    const statCards = [
        {
            title: 'TOTAL KARYAWAN',
            value: stats.total_employees,
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: '+12%',
            desc: 'Karyawan Terdaftar'
        },
        {
            title: 'HADIR HARI INI',
            value: stats.present_today,
            icon: UserCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+5%',
            desc: 'Absensi Masuk'
        },
        {
            title: 'TERLAMBAT',
            value: stats.late_today,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '-2%',
            desc: 'Diluar Toleransi'
        },
        {
            title: 'IZIN / CUTI',
            value: stats.excused_today,
            icon: FileText,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50/50',
            trend: 'Stabil',
            desc: 'Berhalangan Hadir'
        },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard | Asaindo Absensi" />

            <div className="space-y-6 pb-6">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 lg:p-6 text-white shadow-md">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-600/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-slate-800/50 rounded-full blur-[30px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-indigo-100">
                                <Zap size={11} className="fill-indigo-400 text-indigo-400" />
                                MANAJEMEN HR
                            </div>

                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                                Ringkasan <span className="text-indigo-400 italic">Dashboard</span>
                            </h1>

                            <p className="text-slate-50 font-medium text-xs max-w-sm leading-relaxed">
                                Pantau kehadiran dan performa karyawan Asaindo Absensi secara real-time.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                                        Bulan
                                    </p>
                                    <Select
                                        value={month_numeric}
                                        onChange={(e) => handleFilterChange('month', e.target.value)}
                                        className="h-9 min-w-[120px] bg-white/10 border-white/10 text-white text-[12px] font-bold uppercase rounded-lg focus:ring-indigo-500/20"
                                    >
                                        {months.map(m => (
                                            <option key={m.value} value={m.value} className="text-slate-900">{m.label}</option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                                        Tahun
                                    </p>
                                    <Select
                                        value={year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="h-9 min-w-[90px] bg-white/10 border-white/10 text-white text-[12px] font-bold uppercase rounded-lg focus:ring-indigo-500/20"
                                    >
                                        {years.map(y => (
                                            <option key={y} value={y} className="text-slate-900">{y}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
                                <Button
                                    onClick={() => handleExport('attendance')}
                                    className="h-9 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold text-[11px] uppercase transition-all shadow active:scale-95 border-none"
                                >
                                    <Download className="mr-2" size={14} />
                                    Export Absensi
                                </Button>
                                <Button
                                    onClick={() => handleExport('overtime')}
                                    className="h-9 px-4 bg-slate-700 text-white hover:bg-slate-800 rounded-lg font-bold text-[11px] uppercase transition-all shadow active:scale-95 border-none"
                                >
                                    <Download className="mr-2" size={14} />
                                    Export Lemburan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-sm", stat.bg, stat.color)}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div className="text-indigo-600 text-[10px] font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 flex items-center gap-1">
                                        <TrendingUp size={10} />
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                                    <p className="text-[11px] text-slate-400 font-medium pt-2 flex items-center gap-1.5">
                                        <span className={cn("w-1.5 h-1.5 rounded-full", stat.color.replace('text', 'bg'))}></span>
                                        {stat.desc}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Attendance */}
                    <Card className="lg:col-span-2 border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <Link href={`\${basePath}/admin/employees`} className="group/title">
                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 group-hover/title:bg-indigo-600 group-hover/title:text-white transition-all">
                                            <Activity size={18} />
                                        </div>
                                        Ringkasan Karyawan
                                        <ArrowRight size={16} className="text-slate-300 group-hover/title:text-indigo-600 group-hover/title:translate-x-1 transition-all" />
                                    </CardTitle>
                                </Link>
                                <p className="text-xs text-slate-400 font-medium ml-12 -mt-1">Estimasi penggajian periode ini.</p>
                            </div>
                            <Link href={`\${basePath}/admin/attendance/manual`} className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center border border-slate-100">
                                <ArrowUpRight size={18} />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 px-6 pb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="py-3">KARYAWAN</th>
                                            <th className="py-3 text-center">TOTAL HARI</th>
                                            <th className="py-3 text-center">MASUK</th>
                                            <th className="py-3 text-right">TOTAL GAJI</th>
                                            <th className="py-3 text-right">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {employee_summaries.map((employee) => (
                                            <tr key={employee.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                                            <img
                                                                src={employee.photo ? `/storage/${employee.photo}` : `https://ui-avatars.com/api/?name=${employee.name}&background=6366f1&color=fff`}
                                                                alt="Avatar"
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-slate-900">{employee.name}</p>
                                                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{employee.salary_type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <p className="text-[13px] text-slate-700 font-bold">{employee.total_days} Hari</p>
                                                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Absen/Izin/Cuti</p>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                            {employee.work_days} Hari
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <p className="text-[14px] font-black text-indigo-600 tracking-tight">
                                                        Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(employee.salary_summary?.grand_total || 0))}
                                                    </p>
                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Estimasi Take Home Pay</p>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`\${basePath}/admin/employees/${employee.id}/attendance`}
                                                            className="w-8 h-8 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center border border-emerald-100 shadow-sm"
                                                            title="Data Kehadiran"
                                                        >
                                                            <FileText size={14} />
                                                        </Link>
                                                        <Link href={`\${basePath}/admin/employees/${employee.id}/edit`} className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center border border-transparent hover:border-indigo-100 shadow-sm hover:shadow-md">
                                                            <ArrowRight size={14} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <Card className="border border-slate-800 shadow-lg bg-slate-900 text-white rounded-xl overflow-hidden p-8 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold tracking-tight">Aksi Cepat</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kontrol Operasional Sistem</p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Link href={`\${basePath}/admin/attendance/manual`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-600 transition-all duration-300 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner">
                                            <CalendarClock size={16} className="text-indigo-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[13px] tracking-tight text-white group-hover:text-white">Absensi Manual</p>
                                            <p className="text-[9px] text-slate-500 group-hover:text-indigo-100 uppercase tracking-widest font-bold">Input Kehadiran</p>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-all" />
                                    </Link>

                                    <Link href={`\${basePath}/admin/employees/create`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-600 transition-all duration-300 group">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner">
                                            <Users size={16} className="text-indigo-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[13px] tracking-tight text-white group-hover:text-white">Tambah Karyawan</p>
                                            <p className="text-[9px] text-slate-500 group-hover:text-indigo-100 uppercase tracking-widest font-bold">Pendaftaran</p>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-all" />
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        {/* Summary Widget */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Integritas Sistem</h4>
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <Activity size={16} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-900 leading-none mb-1">Database API</p>
                                            <p className="text-[9px] font-medium text-slate-400 uppercase">Aktif</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-100 shadow-xs">LIVE</p>
                                </div>

                                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-900 leading-none mb-1">Mesin React</p>
                                            <p className="text-[9px] font-medium text-slate-400 uppercase">Frontend</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-xs">v3.0</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ASAINDO ABSENSI HRM SYSTEM</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
