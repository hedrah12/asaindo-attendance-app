import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Settings,
    ShieldCheck,
    Clock,
    DollarSign,
    HeartPulse,
    Plane,
    Truck,
    Utensils,
    Save,
    Info,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    cn
} from '@/Components/ui';
import { Input, Label, Switch } from '@/Components/ui/Forms';

export default function PayrollSettings({ settings }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const [activeTab, setActiveTab] = useState('umum');

    // Flatten settings for useForm
    const initialData = {};
    Object.values(settings).flat().forEach(s => {
        initialData[s.key] = s.type === 'boolean'
            ? (s.value === 'true' || s.value === true)
            : s.value;
    });

    const { data, setData, post, processing, errors } = useForm({
        settings: initialData
    });

    const handleToggle = (key) => {
        setData('settings', {
            ...data.settings,
            [key]: !data.settings[key]
        });
    };

    const handleChange = (key, value) => {
        setData('settings', {
            ...data.settings,
            [key]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`\${basePath}/admin/settings/payroll`);
    };

    const TabButton = ({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
            <button
                onClick={() => setActiveTab(id)}
                className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 z-10 relative",
                    isActive
                        ? "text-indigo-600 border-indigo-600 bg-indigo-50/50"
                        : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
                )}
            >
                <Icon size={16} className={cn(isActive ? "animate-pulse" : "")} />
                {label}
            </button>
        );
    };

    return (
        <AdminLayout>
            <Head title="Kebijakan Penggajian | ASAINDO" />

            <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Visual Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <Settings size={12} className="animate-spin-slow" />
                            KONFIGURASI SISTEM
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
                            Kebijakan <span className="text-indigo-600 italic">Penggajian.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">
                            Atur parameter otomatisasi hitung gaji, potongan keterlambatan, dan eligibility tunjangan.
                        </p>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="h-14 px-8 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group border-none"
                    >
                        <Save className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                        {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                    </Button>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="flex border-b border-slate-100">
                        <TabButton id="umum" label="Pengaturan Umum" icon={ShieldCheck} />
                        <TabButton id="fixed" label="Karyawan Tetap" icon={DollarSign} />
                        <TabButton id="daily" label="Karyawan Harian" icon={Clock} />
                    </div>

                    <div className="p-8">
                        {activeTab === 'umum' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="font-black text-slate-900 leading-none">Kedisiplinan</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Denda Keterlambatan</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", data.settings.late_penalty_active ? "text-emerald-600" : "text-slate-400")}>
                                                    {data.settings.late_penalty_active ? 'AKTIF' : 'NON-AKTIF'}
                                                </span>
                                                <Switch
                                                    checked={data.settings.late_penalty_active}
                                                    onChange={() => handleToggle('late_penalty_active')}
                                                />
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "grid grid-cols-1 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300",
                                            !data.settings.late_penalty_active && "opacity-50 grayscale pointer-events-none"
                                        )}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nominal Denda (IDR)</Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-600">Rp</div>
                                                        <Input
                                                            type="number"
                                                            value={data.settings.late_penalty_nominal}
                                                            onChange={e => handleChange('late_penalty_nominal', e.target.value)}
                                                            className="h-12 pl-11 bg-white border-slate-200 rounded-2xl focus:ring-indigo-500/10 font-black text-slate-700 outline-none transition-all shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Per Berapa Menit</Label>
                                                    <div className="relative group">
                                                        <Input
                                                            type="number"
                                                            value={data.settings.late_penalty_interval}
                                                            onChange={e => handleChange('late_penalty_interval', e.target.value)}
                                                            className="h-12 pr-12 bg-white border-slate-200 rounded-2xl focus:ring-indigo-500/10 font-black text-slate-700 outline-none transition-all shadow-sm"
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Menit</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Batas Toleransi (Menit)</Label>
                                                    <div className="relative group">
                                                        <Input
                                                            type="number"
                                                            value={data.settings.late_tolerance_minutes}
                                                            onChange={e => handleChange('late_tolerance_minutes', e.target.value)}
                                                            className="h-12 pr-12 bg-white border-slate-200 rounded-2xl focus:ring-indigo-500/10 font-black text-slate-700 outline-none transition-all shadow-sm"
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Menit</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Denda Berhenti (Jam)</Label>
                                                    <div className="relative group">
                                                        <Input
                                                            type="time"
                                                            value={data.settings.late_penalty_stop_time}
                                                            onChange={e => handleChange('late_penalty_stop_time', e.target.value)}
                                                            className="h-12 bg-white border-slate-200 rounded-2xl focus:ring-indigo-500/10 font-black text-slate-700 outline-none transition-all shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden flex flex-col justify-center">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                                        <Info className="mb-4 text-indigo-200" size={24} />
                                        <h4 className="text-xl font-bold mb-2">Informasi Penting</h4>
                                        <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">
                                            Pengaturan denda keterlambatan bersifat global untuk seluruh karyawan. Sistem akan menghitung selisih menit keterlambatan dikurangi masa toleransi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'fixed' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Leave Policy */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 tracking-tight">Kebijakan Absen (Gaji Pokok)</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                                            {[
                                                { key: 'fixed_paid_izin', label: 'Izin Tetap Dibayar', icon: Info, color: 'indigo' },
                                                { key: 'fixed_paid_sakit', label: 'Sakit Tetap Dibayar', icon: HeartPulse, color: 'rose' },
                                                { key: 'fixed_paid_cuti', label: 'Cuti Tetap Dibayar', icon: Plane, color: 'emerald' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-slate-100/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center`}>
                                                            <item.icon size={14} />
                                                        </div>
                                                        <Label className="text-sm font-bold text-slate-700">{item.label}</Label>
                                                    </div>
                                                    <Switch checked={data.settings[item.key]} onChange={() => handleToggle(item.key)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Allowance Policy */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                                <Truck size={20} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 tracking-tight">Kebijakan Tunjangan</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 space-y-4">
                                            {[
                                                { key: 'fixed_transport_on_late', label: 'Transport Cair Jika Telat', desc: 'Cair meskipun terlambat masuk' },
                                                { key: 'fixed_food_on_late', label: 'Makan Cair Jika Telat', desc: 'Cair meskipun terlambat masuk' },
                                                { key: 'fixed_transport_on_leave', label: 'Transport Cair Saat Izin', desc: 'Cair saat status cuti/sakit/izin' },
                                                { key: 'fixed_food_on_leave', label: 'Makan Cair Saat Izin', desc: 'Cair saat status cuti/sakit/izin' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-slate-100/50">
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-bold text-slate-800">{item.label}</p>
                                                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                                                    </div>
                                                    <Switch checked={data.settings[item.key]} onChange={() => handleToggle(item.key)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'daily' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Daily Leave Policy */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                <Clock size={20} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 tracking-tight">Kebijakan Absen (Upah Harian)</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                                            {[
                                                { key: 'daily_paid_izin', label: 'Izin Tetap Dibayar', icon: Info, color: 'indigo' },
                                                { key: 'daily_paid_sakit', label: 'Sakit Tetap Dibayar', icon: HeartPulse, color: 'rose' },
                                                { key: 'daily_paid_cuti', label: 'Cuti Tetap Dibayar', icon: Plane, color: 'emerald' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-slate-100/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center`}>
                                                            <item.icon size={14} />
                                                        </div>
                                                        <Label className="text-sm font-bold text-slate-700">{item.label}</Label>
                                                    </div>
                                                    <Switch checked={data.settings[item.key]} onChange={() => handleToggle(item.key)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Daily Allowance Policy */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                                <Utensils size={20} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 tracking-tight">Kebijakan Tunjangan</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4">
                                            {[
                                                { key: 'daily_transport_on_late', label: 'Transport Cair Jika Telat', desc: 'Cair meskipun terlambat masuk' },
                                                { key: 'daily_food_on_late', label: 'Makan Cair Jika Telat', desc: 'Cair meskipun terlambat masuk' },
                                                { key: 'daily_transport_on_leave', label: 'Transport Cair Saat Izin', desc: 'Cair saat status cuti/sakit/izin' },
                                                { key: 'daily_food_on_leave', label: 'Makan Cair Saat Izin', desc: 'Cair saat status cuti/sakit/izin' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border border-slate-100/50">
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-bold text-slate-800">{item.label}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                                    </div>
                                                    <Switch checked={data.settings[item.key]} onChange={() => handleToggle(item.key)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 shadow-sm group px-12">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-900 tracking-tight leading-none mb-1">Seluruh Perubahan Terintegrasi</h4>
                            <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest text-center">Dashboard, PDF, & Excel</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
