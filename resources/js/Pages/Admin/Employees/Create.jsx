import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    User,
    ArrowLeft,
    Clock,
    Image as ImageIcon,
    Mail,
    Lock,
    DollarSign,
    Save,
    ChevronLeft,
    Loader2,
    Plus
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button
} from '@/Components/ui';
import { Input, Label, Select } from '@/Components/ui/Forms';

export default function CreateEmployee() {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        salary: 3000000,
        allowance_transport: 500000,
        allowance_food: 500000,
        salary_type: 'tetap',
        photo: null,
        work_in_time: '08:00',
        work_out_time: '17:00',
        can_overtime: false,
        overtime_nominal: 20000,
        overtime_in_time: '18:00',
        overtime_out_time: '21:00',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`\${basePath}/admin/employees`);
    };

    return (
        <AdminLayout>
            <Head title="Pendaftaran Karyawan | ASAINDO" />

            <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
                <div className="flex items-center gap-4">
                    <Link href={`\${basePath}/admin/employees`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-600 shadow-sm">
                            <Plus size={12} className="fill-indigo-600" />
                            MANAJEMEN PERSONALIA
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Pendaftaran <span className="text-indigo-600 italic">Karyawan.</span></h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Informasi Dasar</CardTitle>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Profil & Kredensial Login</p>
                                </div>
                                <User className="text-slate-100 relative z-10" size={32} />
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-3 group">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lengkap Karyawan</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-700 placeholder:text-slate-400 transition-all outline-none"
                                        placeholder="Masukkan nama lengkap sesuai KTP..."
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Perusahaan</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                            <Input
                                                type="email"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-sm text-slate-600 outline-none"
                                                placeholder="nama@perusahaan.id"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Kata Sandi Sistem</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                            <Input
                                                type="password"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-sm text-slate-600 outline-none"
                                                placeholder="••••••••"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                            />
                                        </div>
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.password}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Salary Info */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden relative">
                            <CardHeader className="p-8 pb-4 border-b border-slate-100">
                                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 leading-none">Konfigurasi Penggajian</CardTitle>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pengaturan Finansial & Bonus</p>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Gaji Pokok</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                                            <Input
                                                type="number"
                                                step="1"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-10 text-lg text-slate-700 outline-none"
                                                value={data.salary}
                                                onChange={e => setData('salary', Math.round(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Transport</Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-600 outline-none"
                                            value={data.allowance_transport}
                                            onChange={e => setData('allowance_transport', Math.round(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Uang Makan</Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-600 outline-none"
                                            value={data.allowance_food}
                                            onChange={e => setData('allowance_food', Math.round(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Jam Masuk Kerja</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                            <Input
                                                type="time"
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-sm text-slate-600 outline-none"
                                                value={data.work_in_time}
                                                onChange={e => setData('work_in_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Jam Pulang Kerja</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                            <Input
                                                type="time"
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold pl-11 text-sm text-slate-600 outline-none"
                                                value={data.work_out_time}
                                                onChange={e => setData('work_out_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-900 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-slate-800 shadow-lg">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
                                    <div className="relative z-10 text-center md:text-left space-y-0.5">
                                        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Mesin Perhitungan</p>
                                        <p className="text-white text-lg font-bold tracking-tight">Mekanisme Payroll</p>
                                    </div>
                                    <div className="relative z-10 w-full md:w-fit">
                                        <Select
                                            className="h-12 w-full md:w-[240px] bg-white/5 border-white/10 text-white rounded-lg font-bold px-6 backdrop-blur-sm hover:bg-white/10 transition-all outline-none"
                                            value={data.salary_type}
                                            onChange={e => setData('salary_type', e.target.value)}
                                        >
                                            <option value="tetap" className="text-slate-900">GAJI TETAP / MONTHLY</option>
                                            <option value="harian" className="text-slate-900">DAILY LOG / ATTENDANCE</option>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Photo Card */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 overflow-hidden text-center group">
                            <CardTitle className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-wider">Identitas Utama</CardTitle>
                            <div className="relative w-36 h-36 mx-auto group">
                                <div className="w-full h-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden text-slate-200 flex items-center justify-center transition-all group-hover:border-indigo-500 group-hover:bg-indigo-50/50 shadow-inner">
                                    {data.photo ? (
                                        <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">PREVIEW ACTIVE</div>
                                    ) : (
                                        <ImageIcon size={40} className="transition-transform group-hover:scale-110" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={e => setData('photo', e.target.files[0])}
                                />
                                <Label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-900 text-white shadow-lg flex items-center justify-center rounded-lg cursor-pointer hover:bg-indigo-600 transition-all border-4 border-white active:scale-95 z-20">
                                    <Plus size={20} />
                                </Label>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium mt-6 uppercase tracking-wider italic">Direkomendasikan Resolusi Tinggi</p>
                            {errors.photo && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.photo}</p>}
                        </Card>

                        {/* Overtime Card */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 overflow-hidden relative group/ot">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        <Clock className="text-indigo-500" size={18} />
                                        Kebijakan Lembur
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hak Lembur Karyawan</p>
                                </div>
                                <div
                                    className="relative inline-flex items-center cursor-pointer"
                                    onClick={() => setData('can_overtime', !data.can_overtime)}
                                >
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={data.can_overtime}
                                        readOnly
                                        id="ot-toggle"
                                    />
                                    <div className="w-12 h-6 bg-slate-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-indigo-600 transition-all"></div>
                                </div>
                            </div>

                            {data.can_overtime && (
                                <div className="space-y-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center block">Nominal Rate / Jam</Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-center text-lg text-indigo-600 focus:ring-indigo-500/10 transition-all outline-none"
                                            value={data.overtime_nominal}
                                            onChange={e => setData('overtime_nominal', Math.round(e.target.value))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center block">Mulai Shift</Label>
                                            <Input
                                                type="time"
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg font-bold text-center text-xs text-slate-600 outline-none"
                                                value={data.overtime_in_time}
                                                onChange={e => setData('overtime_in_time', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center block">Selesai Shift</Label>
                                            <Input
                                                type="time"
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg font-bold text-center text-xs text-slate-600 outline-none"
                                                value={data.overtime_out_time}
                                                onChange={e => setData('overtime_out_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!data.can_overtime && (
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic border-t border-slate-50 pt-6 text-center">Karyawan tidak diizinkan untuk mencatat waktu kerja lembur.</p>
                            )}
                        </Card>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-md transition-all active:scale-[0.98] border-none"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <div className="flex items-center gap-3 relative z-10">
                                    DAFTARKAN KARYAWAN
                                    <Save size={20} />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
