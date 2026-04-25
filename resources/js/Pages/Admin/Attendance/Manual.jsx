import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CalendarClock,
    ArrowLeft,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Fingerprint,
    Search,
    MapPin
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    cn
} from '@/Components/ui';
import { Input, Label, Select } from '@/Components/ui/Forms';

export default function ManualAttendance({ users }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        status: 'hadir',
        note: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`\${basePath}/admin/attendance/manual`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Absensi Manual | ASAINDO" />

            <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in zoom-in duration-700">
                {/* Visual Header */}
                <div className="flex items-center gap-4">
                    <Link href={`\${basePath}/admin`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 shadow-sm w-fit">
                            <Fingerprint size={12} className="fill-indigo-600/20" />
                            SISTEM ABSENSI
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Absensi <span className="text-indigo-600 italic">Manual.</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-900 p-10 pb-20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/5">
                                        Koreksi Data
                                    </div>
                                    <CardTitle className="text-white text-2xl font-bold tracking-tight leading-none">Formulir Input Data</CardTitle>
                                    <p className="text-slate-400 text-xs font-medium mt-2 max-w-sm">Gunakan formulir ini untuk memperbaiki data kehadiran yang terlewat atau terjadi anomali sistem.</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 -mt-16 bg-white rounded-t-2xl relative z-10 border-t border-white/20">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Pilih Karyawan Target</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                                <Search size={18} />
                                            </div>
                                            <Select
                                                className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold text-slate-900 appearance-none transition-all outline-none"
                                                value={data.user_id}
                                                onChange={e => setData('user_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Cari Nama Karyawan...</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                                ))}
                                            </Select>
                                        </div>
                                        {errors.user_id && <p className="text-xs text-red-500 font-bold ml-1">{errors.user_id}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-3 group">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tanggal Absensi</Label>
                                            <Input
                                                type="date"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold text-slate-700 outline-none"
                                                value={data.date}
                                                onChange={e => setData('date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3 group">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Masuk (WIB)</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                                <Input
                                                    type="time"
                                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-slate-600 outline-none"
                                                    value={data.check_in}
                                                    onChange={e => setData('check_in', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 group">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Pulang (WIB)</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                                <Input
                                                    type="time"
                                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-slate-600 outline-none"
                                                    value={data.check_out}
                                                    onChange={e => setData('check_out', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Status Kehadiran</Label>
                                        <div className="grid grid-cols-5 gap-3">
                                            {['hadir', 'telat', 'sakit', 'izin', 'cuti'].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setData('status', status)}
                                                    className={cn(
                                                        "h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-200 relative overflow-hidden",
                                                        data.status === status
                                                            ? "bg-indigo-600 text-white shadow-md -translate-y-0.5"
                                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <span className="relative z-10">{status}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Catatan Internal</Label>
                                        <textarea
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-indigo-500/10 transition-all outline-none min-h-[120px]"
                                            placeholder="Berikan alasan input manual (Contoh: Lupa bawa HP, error server, dll)..."
                                            value={data.note}
                                            onChange={e => setData('note', e.target.value)}
                                        ></textarea>
                                    </div>

                                    <Button
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-md transition-all active:scale-[0.98] border-none"
                                        disabled={processing}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            {processing ? 'SEDANG MEMPROSES...' : 'SIMPAN ABSENSI'}
                                            <CalendarClock size={20} />
                                        </div>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-slate-800 shadow-lg bg-slate-900 text-white rounded-xl p-8 relative overflow-hidden group/audit">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold tracking-tight leading-tight">Keamanan & Audit.</h4>
                                    <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/5">
                                        <AlertCircle size={20} className="text-indigo-400 shrink-0" />
                                        <p className="text-[11px] font-medium leading-relaxed opacity-90 uppercase tracking-wider">Input manual akan dicatat sebagai <strong className="text-white underline">"Manual Override"</strong> dalam log audit.</p>
                                    </div>
                                    <div className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/5">
                                        <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                                        <p className="text-[11px] font-medium leading-relaxed opacity-90 uppercase tracking-wider">Sinkronisasi otomatis dengan mesin kalkulasi gaji real-time.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 relative group/geo">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">Geolocation Hub</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manual Override Mode</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                                    <MapPin size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">Manual input menonaktifkan verifikasi GPS. Validasi bukti fisik sebelum otorisasi dilakukan oleh administrator.</p>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Integritas Sistem v3.1</p>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>)}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
