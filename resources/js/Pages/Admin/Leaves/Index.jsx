import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    User,
    ArrowUpRight,
    Search,
    Filter,
    MessageSquare,
    Zap
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge
} from '@/Components/ui';
import { cn } from '@/Components/ui';

export default function LeaveRequests({ leaveRequests = [] }) {
    const basePath = window.location.pathname.includes('/public') ? window.location.pathname.substring(0, window.location.pathname.indexOf('/public') + 7) : '';
    const { post, processing } = useForm();

    const handleAction = (id, action) => {
        if (confirm(`Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) {
            post(`\${basePath}/admin/leaves/${id}/${action}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Persetujuan Izin | Asaindo Absensi" />

            <div className="space-y-6 pb-10">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <Zap size={12} className="fill-indigo-600" />
                            MENUNGGU TINJAUAN
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Pengajuan <span className="text-indigo-600 italic">Izin.</span></h1>
                        <p className="text-slate-400 font-medium text-xs max-w-sm leading-relaxed mt-1">Kelola absensi karyawan yang berhalangan hadir dengan sistem persetujuan terpusat.</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-4 overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
                            <input
                                placeholder="Cari nama atau alasan..."
                                className="w-full pl-10 h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-indigo-500/10 font-bold text-xs text-slate-600 placeholder:text-slate-400 transition-all outline-none"
                            />
                        </div>
                        <Button variant="outline" className="h-10 px-4 rounded-lg border-slate-200 bg-white text-slate-500 text-xs font-bold shadow-sm group hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95">
                            <Filter size={14} className="mr-2 text-slate-400 group-hover:text-indigo-600" />
                            FILTER STATUS
                        </Button>
                    </div>
                </Card>

                {/* Grid Deck */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {leaveRequests.map((request) => (
                        <Card key={request.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 group-hover:rotate-3 transition-all duration-500">
                                            <img
                                                src={request.user?.photo ? `/storage/${request.user.photo}` : `https://ui-avatars.com/api/?name=${request.user?.name}&background=6366f1&color=fff`}
                                                alt={request.user?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white shadow-md rounded-lg flex items-center justify-center border border-slate-100 text-indigo-500 transition-transform group-hover:scale-110">
                                            <FileText size={14} />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-none">{request.user?.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border",
                                                        request.type === 'sakit' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                    )}>
                                                        {request.type}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID #{request.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest">{request.status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar size={12} className="text-indigo-400" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Durasi</p>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-700 tracking-tight leading-none">
                                                    {request.start_date === request.end_date
                                                        ? request.start_date
                                                        : `${request.start_date} - ${request.end_date}`}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MessageSquare size={12} className="text-indigo-400" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Alasan</p>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 italic line-clamp-1 leading-none tracking-tight">"{request.reason}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {request.status === 'pending' && (
                                    <div className="flex items-center p-4 bg-slate-50/50 border-t border-slate-100 gap-4">
                                        <Button
                                            onClick={() => handleAction(request.id, 'reject')}
                                            variant="outline"
                                            className="flex-1 h-10 rounded-lg border-slate-200 bg-white text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-xs font-bold transition-all shadow-sm active:scale-95 tracking-tight"
                                            disabled={processing}
                                        >
                                            <XCircle className="mr-2" size={16} />
                                            TOLAK
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(request.id, 'approve')}
                                            className="flex-1 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 tracking-tight border-none"
                                            disabled={processing}
                                        >
                                            <CheckCircle2 className="mr-2" size={16} />
                                            SETUJUI
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {leaveRequests.length === 0 && (
                        <Card className="xl:col-span-2 border border-slate-200 shadow-sm bg-white rounded-xl p-16 text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner overflow-hidden relative group/empty">
                                <FileText className="text-slate-200 relative z-10 group-hover:scale-110 transition-transform duration-700" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Inbox <span className="text-indigo-600">Mulus.</span></h3>
                                <p className="text-slate-400 font-medium text-xs max-w-xs mx-auto leading-relaxed">Semua pengajuan izin telah diproses. Tidak ada antrian saat ini.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
