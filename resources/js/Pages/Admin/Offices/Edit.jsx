import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    MapPin,
    ChevronLeft,
    Save,
    Loader2,
    ShieldCheck,
    Navigation,
    Clock
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button
} from '@/Components/ui';
import { Input, Label } from '@/Components/ui/Forms';

export default function EditOffice({ office }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST', // Original was POST in routes for update
        name: office.name || '',
        latitude: office.latitude || '',
        longitude: office.longitude || '',
        radius: office.radius || 100,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`\${basePath}/admin/offices/${office.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Edit Lokasi: ${office.name}`} />

            <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-700">
                <div className="flex items-center gap-4">
                    <Link href={`\${basePath}/admin/offices`} className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-600 shadow-sm">
                            <MapPin size={12} className="fill-indigo-600" />
                            GEOFENCING MANAGEMENT
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Modify <span className="text-indigo-600 italic">{office.name}.</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-slate-100 flex flex-row items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-50"></div>
                                <div className="relative z-10">
                                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 leading-none">Perimeter Override</CardTitle>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Adjust geolocation coordinates & boundaries</p>
                                </div>
                                <Navigation className="text-slate-200 relative z-10" size={32} />
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3 group">
                                        <Label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Kantor / Area</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold px-6 text-slate-700 outline-none transition-all"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="latitude" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Latitude</Label>
                                            <Input
                                                id="latitude"
                                                value={data.latitude}
                                                onChange={e => setData('latitude', e.target.value)}
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-indigo-500/10 font-bold text-sm text-slate-600 outline-none shadow-sm text-center"
                                            />
                                            {errors.latitude && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.latitude}</p>}
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label htmlFor="longitude" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Longitude</Label>
                                            <Input
                                                id="longitude"
                                                value={data.longitude}
                                                onChange={e => setData('longitude', e.target.value)}
                                                className="h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-indigo-500/10 font-bold text-sm text-slate-600 outline-none shadow-sm text-center"
                                            />
                                            {errors.longitude && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.longitude}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="radius" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Geofencing Radius</Label>
                                            <span className="text-xl font-bold text-indigo-600">{data.radius} <span className="text-[10px] opacity-60">M</span></span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="1000"
                                            value={data.radius}
                                            onChange={e => setData('radius', e.target.value)}
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="flex justify-between text-[9px] font-bold text-slate-300 tracking-widest uppercase">
                                            <span>MIN: 10M</span>
                                            <span>MAX: 1000M</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-bold shadow-md transition-all active:scale-[0.98] border-none"
                                        disabled={processing}
                                    >
                                        <div className="flex items-center gap-3 relative z-10 tracking-tight">
                                            {processing ? (
                                                <Loader2 className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    SIMPAN PERUBAHAN
                                                    <Save size={20} />
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-lg bg-indigo-600 text-white rounded-xl p-8 relative overflow-hidden group/alert">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover/alert:scale-110 transition-transform duration-1000"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                                    <ShieldCheck size={24} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold tracking-tight leading-tight uppercase">Operational Security.</h4>
                                    <div className="w-12 h-1 bg-indigo-400 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold leading-relaxed opacity-90 uppercase tracking-wider border-l-2 border-white/20 pl-4">Pastikan koordinat diperiksa menggunakan Satelit Mode untuk akurasi presisi geofencing.</p>
                                    <div className="flex gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-indigo-300 mt-1 shrink-0 animate-pulse"></div>
                                        <p className="text-[9px] font-bold tracking-wider opacity-80 uppercase leading-relaxed">Perubahan radius akan berdampak langsung pada validasi absensi karyawan di lapangan.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
