import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    User,
    ArrowLeft,
    Clock,
    Image as ImageIcon,
    Save,
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

export default function EditEmployee({ employee }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        salary: Math.round(employee.salary || 0),
        allowance_transport: Math.round(employee.allowance_transport || 0),
        allowance_food: Math.round(employee.allowance_food || 0),
        salary_type: employee.salary_type || 'tetap',
        photo: null,
        work_in_time: employee.work_in_time || '08:00',
        work_out_time: employee.work_out_time || '17:00',
        can_overtime: employee.can_overtime || false,
        overtime_nominal: Math.round(employee.overtime_nominal || 0),
        overtime_in_time: employee.overtime_in_time || '',
        overtime_out_time: employee.overtime_out_time || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since we are uploading a file with PUT, we use POST with _method spoofing
        post(`\${basePath}/admin/employees/${employee.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Edit Karyawan: ${employee.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
                <div className="flex items-center gap-4">
                    <Link href={`\${basePath}/admin/employees`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-600 shadow-sm">
                        <User size={12} className="fill-indigo-600/20" />
                        MODIFIKASI PERSONALIA
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Sunting Profil <span className="text-indigo-600 italic">{employee.name}.</span></h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            {/* Basic Info Card */}
                            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                                <CardHeader className="p-8 pb-4 border-b border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 leading-none relative z-10">Informasi Dasar</CardTitle>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2 relative z-10">Kredensial Profil & Akses</p>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-3 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lengkap Karyawan</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-700 placeholder:text-slate-400 transition-all outline-none"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3 group">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Perusahaan</Label>
                                            <Input
                                                type="email"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-sm text-slate-600 outline-none"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-3 group">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Token Keamanan</Label>
                                            <Input
                                                type="password"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-sm text-slate-600 outline-none"
                                                placeholder="••••••••"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Salary Configuration Card */}
                            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                                <CardHeader className="p-8 pb-4 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 leading-none">Konfigurasi Penggajian</CardTitle>
                                        <div className="h-6 px-2 rounded-md bg-indigo-600 text-white text-[9px] font-bold flex items-center shadow-sm">PAYROLL V2</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gaji Pokok</Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-center text-lg text-indigo-600 focus:ring-indigo-500/10 outline-none"
                                                value={data.salary}
                                                onChange={e => setData('salary', Math.round(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transport</Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-center text-sm text-slate-600 outline-none"
                                                value={data.allowance_transport}
                                                onChange={e => setData('allowance_transport', Math.round(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uang Makan</Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-center text-sm text-slate-600 outline-none"
                                                value={data.allowance_food}
                                                onChange={e => setData('allowance_food', Math.round(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tipe Strategi</Label>
                                        <Select
                                            className="h-12 w-full bg-slate-900 border-none text-white rounded-xl font-bold px-6 focus:ring-indigo-500/10 transition-all outline-none text-sm"
                                            value={data.salary_type}
                                            onChange={e => setData('salary_type', e.target.value)}
                                        >
                                            <option value="tetap">PENETAPAN GAJI TETAP (BULANAN)</option>
                                            <option value="harian">SISTEM GAJI HARIAN (ATTENDANCE BASED)</option>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-inner mt-6">
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
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            {/* Photo Master Card */}
                            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 text-center group">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Aset Identitas</p>
                                <div className="relative w-40 h-40 mx-auto">
                                    <div className="w-full h-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500 shadow-inner">
                                        <img
                                            src={employee.photo ? `/storage/${employee.photo}` : `https://ui-avatars.com/api/?name=${employee.name}&background=6366f1&color=ffffff`}
                                            alt="Employee Portrait"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="photo-upload"
                                        onChange={e => setData('photo', e.target.files[0])}
                                    />
                                    <Label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-indigo-600 shadow-lg flex items-center justify-center rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white transition-all border-4 border-white active:scale-90">
                                        <Plus size={20} />
                                    </Label>
                                </div>
                                <div className="mt-8 space-y-1">
                                    <h4 className="font-bold text-slate-900 uppercase tracking-tight text-base">{employee.name}</h4>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Token Identitas Utama</p>
                                </div>
                                {errors.photo && <p className="text-[10px] text-red-500 font-bold mt-4">{errors.photo}</p>}
                            </Card>

                            {/* OT Rule Card */}
                            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-8 overflow-hidden relative group/ot">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                                <Clock size={20} />
                                            </div>
                                            Kebijakan Lembur
                                        </CardTitle>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-12">Kelayakan Sistem</p>
                                    </div>
                                    <div
                                        className="relative inline-flex items-center cursor-pointer"
                                        onClick={() => setData('can_overtime', !data.can_overtime)}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            id="can_overtime"
                                            checked={data.can_overtime}
                                            readOnly
                                        />
                                        <div className="w-12 h-6 bg-slate-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-indigo-600 transition-all"></div>
                                    </div>
                                </div>

                                {data.can_overtime && (
                                    <div className="space-y-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-500">
                                        <div className="space-y-3 text-center">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nominal Per Jam</Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-center text-lg text-indigo-600 focus:ring-indigo-500/10 outline-none"
                                                value={data.overtime_nominal}
                                                onChange={e => setData('overtime_nominal', Math.round(e.target.value))}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center block">Mulai Shift</Label>
                                                <Input
                                                    type="time"
                                                    className="h-10 bg-slate-50 border-slate-200 rounded-lg font-bold text-center text-xs text-slate-600 outline-none"
                                                    value={data.overtime_in_time}
                                                    onChange={e => setData('overtime_in_time', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center block">Selesai Shift</Label>
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
                            </Card>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-md transition-all active:scale-[0.98] border-none"
                                disabled={processing}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    {processing ? 'SYNCING...' : 'SIMPAN PERUBAHAN'}
                                    <Save size={20} />
                                </div>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
