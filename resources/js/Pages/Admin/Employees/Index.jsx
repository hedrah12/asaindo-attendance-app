import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Download,
    IdCard,
    Briefcase,
    Mail,
    FileText
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge
} from '@/Components/ui';
import { Input } from '@/Components/ui/Forms';

import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function EmployeeIndex({ employees, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Use a small debounce or wait for Enter. Let's do a simple Enter or button for now, 
        // or just fire it as the user types with a timeout.
    };

    const performSearch = () => {
        router.get(`\${basePath}/admin/employees`, { search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Anggota | ASAINDO" />

            <div className="space-y-8 pb-10">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/30 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <Users size={12} className="fill-indigo-600" />
                            PERSONNEL MANAGEMENT
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-none">Database <span className="text-indigo-600 italic">Karyawan.</span></h1>
                        <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">Kelola infrastruktur personil Anda dengan presisi. Pantau status, riwayat, dan detail gaji secara real-time.</p>
                    </div>
                    <Link href={`\${basePath}/admin/employees/create`}>
                        <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-sm shadow-md transition-all border-none">
                            <UserPlus className="mr-2" size={18} />
                            TAMBAH KARYAWAN
                        </Button>
                    </Link>
                </div>

                {/* Filter & Search */}
                <Card className="border border-slate-200 shadow-sm bg-white rounded-xl p-6 overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" size={18} />
                            <Input
                                placeholder="Cari berdasarkan nama, email, atau jabatan..."
                                className="w-full pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10 font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all"
                                value={search}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={performSearch}
                                className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-slate-800 active:scale-95 transition-all"
                            >
                                <Filter size={16} className="mr-2" />
                                CARI
                            </Button>
                            <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 bg-white text-slate-600 text-xs font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
                                <Download size={16} className="mr-2 text-slate-400" />
                                EXPORT
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Data Table */}
                <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">PROFIL KARYAWAN</th>
                                        <th className="px-6 py-4">KONTAK & EMAIL</th>
                                        <th className="px-6 py-4">GAJI & JABATAN</th>
                                        <th className="px-6 py-4 text-center">STATUS</th>
                                        <th className="px-6 py-4 text-right">OPSI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="group hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                                                        <img
                                                            src={employee.photo ? `/storage/${employee.photo}` : `https://ui-avatars.com/api/?name=${employee.name}&background=6366f1&color=fff`}
                                                            alt={employee.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{employee.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{employee.phone || 'TIDAK ADA TELEPON'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 group/email">
                                                    <Mail size={12} className="text-slate-400 group-hover/email:text-indigo-500" />
                                                    <p className="text-[13px] text-slate-600 font-medium">{employee.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-[13px] text-slate-900 font-bold flex items-center gap-2">
                                                        <Briefcase size={12} className="text-indigo-400" />
                                                        {employee.salary_type}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium pl-5">
                                                        Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(employee.salary || 0))}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                                    {employee.roles?.[0]?.name || 'EMPLOYEE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    <Link href={`\${basePath}/admin/employees/${employee.id}/attendance`} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all border border-slate-200 shadow-sm">
                                                        <FileText size={14} />
                                                    </Link>
                                                    <Link href={`\${basePath}/admin/employees/${employee.id}/edit`} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all border border-slate-200">
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm transition-all border border-slate-200">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
