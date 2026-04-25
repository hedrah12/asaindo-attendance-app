import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    MapPin,
    Plus,
    Navigation,
    Clock,
    Target,
    Edit3,
    Trash2,
    ArrowRight,
    Map as MapIcon,
    Layers
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge
} from '@/Components/ui';

export default function OfficeIndex({ offices }) {
    return (
        <AdminLayout>
            <Head title="Lokasi Kantor | ASAINDO" />

            <div className="space-y-8 pb-10">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <MapPin size={12} className="fill-indigo-600" />
                            LOKASI PERUSAHAAN
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-none">Titik <span className="text-indigo-600 italic">Lokasi.</span></h1>
                        <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">Kelola titik lokasi absensi menggunakan sistem koordinat presisi tinggi dan radius digital.</p>
                    </div>
                    <Link href={`\${basePath}/admin/offices/create`}>
                        <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-sm shadow-md transition-all border-none">
                            <Plus className="mr-2" size={18} />
                            TAMBAH CABANG
                        </Button>
                    </Link>
                </div>

                {/* Grid Deck */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {offices.map((office) => (
                        <Card key={office.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden group">
                            <CardHeader className="p-0 relative h-48 overflow-hidden bg-slate-100">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 transition-opacity"></div>
                                <img
                                    src={office.photo ? `/storage/${office.photo}` : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'}
                                    alt={office.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <Link href={`\${basePath}/admin/offices/${office.id}/edit`} className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all shadow-sm">
                                        <Edit3 size={16} />
                                    </Link>
                                    <button className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-500 transition-all shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-5 left-6 z-20">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider mb-2">
                                        <MapPin size={10} />
                                        ID #{office.id}
                                    </div>
                                    <CardTitle className="text-white text-xl font-bold tracking-tight">{office.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-xs">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={12} className="text-indigo-500" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radius</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900 tracking-tight">{office.radius}<span className="text-[10px] text-slate-400 ml-1 font-medium">METER</span></p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-xs">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Layers size={12} className="text-emerald-500" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinat</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-600 truncate tracking-tight">{office.latitude}, {office.longitude}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl shadow-inner border border-slate-800 group/personnel">
                                    <div className="flex -space-x-2.5 relative z-10">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-lg border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=U${i}&background=6366f1&color=fff`} alt="Avatar" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-lg border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                                            +12
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Personil</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            <p className="text-indigo-400 text-[10px] font-bold tracking-wider">AKTIF</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Link href={`\${basePath}/admin/offices/create`} className="group h-full">
                        <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <Plus size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-400 group-hover:text-indigo-600 mt-6 transition-colors tracking-tight">Tambah Cabang</h4>
                            <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">Ekspansi Bisnis</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
