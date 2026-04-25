import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    MapPin,
    ArrowLeft,
    Navigation,
    Clock,
    Target,
    Save,
    Map as MapIcon,
    ShieldCheck,
    ChevronLeft,
    Plus,
    Loader2
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button
} from '@/Components/ui';
import { Input, Label } from '@/Components/ui/Forms';

export default function CreateOffice() {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        radius: 100,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`\${basePath}/admin/offices`);
    };

    return (
        <AdminLayout>
            <Head title="Konfigurasi Lokasi | ASAINDO" />

            <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
                <div className="flex items-center gap-4">
                    <Link href={`\${basePath}/admin/offices`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-600 shadow-sm">
                            <Plus size={12} className="fill-indigo-600" />
                            GEOFENCING CONFIGURATION
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Point <span className="text-indigo-600 italic">Lokasi Baru.</span></h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Location Info */}
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-slate-100 flex flex-row items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-50"></div>
                                <div className="relative z-10">
                                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 leading-none">Geospasial</CardTitle>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Koordinat & Perimeter Area</p>
                                </div>
                                <MapIcon className="text-slate-200 relative z-10" size={32} />
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-3 group">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Cabang / Lokasi</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-700 placeholder:text-slate-400 transition-all outline-none"
                                        placeholder="Contoh: Kantor Pusat Jakarta"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-bold tracking-tight">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Latitude</Label>
                                        <div className="relative">
                                            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                            <Input
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-indigo-500/10 font-bold pl-10 text-xs text-slate-600 outline-none shadow-sm"
                                                placeholder="-6.1234..."
                                                value={data.latitude}
                                                onChange={e => setData('latitude', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Longitude</Label>
                                        <div className="relative">
                                            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                            <Input
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-indigo-500/10 font-bold pl-10 text-xs text-slate-600 outline-none shadow-sm"
                                                placeholder="106.1234..."
                                                value={data.longitude}
                                                onChange={e => setData('longitude', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-center px-1">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radius Amman (Meter)</Label>
                                        <span className="text-xl font-bold text-indigo-600 tracking-tight">{data.radius}<span className="text-[10px] ml-1 opacity-50">M</span></span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min="10"
                                            max="1000"
                                            step="10"
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                            value={data.radius}
                                            onChange={e => setData('radius', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider px-1">
                                        <span>Close Range</span>
                                        <span>Corporate Zone</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 bg-slate-900 rounded-xl shadow-lg text-white relative overflow-hidden group border border-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50"></div>
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="w-12 h-12 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">Geofencing Active: Absensi dibatasi dalam radius <strong className="text-indigo-400 font-bold">{data.radius} meter</strong> dari perimeter koordinat.</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-md transition-all active:scale-[0.98] border-none"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <div className="flex items-center gap-3 relative z-10 tracking-tight">
                                    SIMPAN LOKASI
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
