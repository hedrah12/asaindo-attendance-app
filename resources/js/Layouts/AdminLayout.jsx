import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    MapPin,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronRight,
    Settings,
    UserCircle,
    Command
} from 'lucide-react';
import { cn } from '@/Components/ui';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getBasePath = () => {
        const path = window.location.pathname;
        if (path.includes('/public')) {
            return path.substring(0, path.indexOf('/public') + 7);
        }
        return '';
    };
    const basePath = getBasePath();

    const navigation = [
        { name: 'Dashboard', href: `${basePath}/admin`, icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Data Karyawan', href: `${basePath}/admin/employees`, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
        { name: 'Absensi Manual', href: `${basePath}/admin/attendance/manual`, icon: CalendarClock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Lokasi Kantor', href: `${basePath}/admin/offices`, icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-100' },
        { name: 'Pengajuan Izin', href: `${basePath}/admin/leaves`, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
        { name: 'Kebijakan Gaji', href: `${basePath}/admin/settings/payroll`, icon: Settings, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const menuClasses = (isActive) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative",
        isActive
            ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
            : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/20">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-[240px] bg-white fixed h-screen z-40 border-r border-slate-200 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center">
                            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">Asaindo<span className="text-indigo-600 ml-1">Absensi</span></span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">HRM SYSTEM</span>
                        </div>
                    </div>
                </div>



                <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
                    {navigation.map((item) => {
                        const isActive = usePage().url === item.href || usePage().url === item.href.replace(basePath, '');
                        return (
                            <Link key={item.name} href={item.href} className={menuClasses(isActive)}>
                                <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
                                    isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:text-indigo-600"
                                )}>
                                    <item.icon size={14} />
                                </div>
                                <span className="tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4">
                    <Link
                        href={`${basePath}/logout`}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-[13px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600">
                            <LogOut size={14} />
                        </div>
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-[240px] flex flex-col min-w-0">
                {/* Header */}
                <header className={cn(
                    "h-16 fixed top-0 right-0 left-0 lg:left-[240px] z-30 px-6 flex items-center justify-between transition-all duration-200",
                    isScrolled ? "bg-white border-b border-slate-200 shadow-sm" : "bg-transparent"
                )}>
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 bg-white shadow-sm border border-slate-200 rounded-lg text-slate-600"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={18} />
                        </button>

                        <div className="hidden md:flex items-center bg-slate-100 border border-transparent px-3 py-1.5 rounded-xl w-[320px] focus-within:bg-white focus-within:border-indigo-300 focus-within:shadow-sm transition-all duration-200">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input
                                placeholder="Cari data..."
                                className="bg-transparent border-none focus:ring-0 text-[13px] font-medium text-slate-600 placeholder:text-slate-400 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                                <Bell size={19} />
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                                <Settings size={19} />
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 p-1.5 pl-2 hover:bg-white border border-transparent hover:border-indigo-100/50 hover:shadow-sm rounded-2xl transition-all cursor-pointer group">
                            <div className="hidden sm:block text-right">
                                <p className="text-[12px] font-bold text-slate-800 leading-none mb-1">{auth.user.name}</p>
                                <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded-md">ADMINISTRATOR</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 border border-indigo-500 shadow-md shadow-indigo-100 overflow-hidden transition-transform group-hover:scale-105">
                                <img src={auth.user.photo ? `/storage/${auth.user.photo}` : `https://ui-avatars.com/api/?name=${auth.user.name}&background=6366f1&color=fff`} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 pt-24 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-80 bg-white flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl">
                        <div className="p-8 flex items-center justify-between border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center">
                                    <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-black text-xl text-slate-900 tracking-tighter">Asaindo<span className="text-indigo-600 ml-1">Absensi</span></span>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = usePage().url === item.href || usePage().url === item.href.replace(basePath, '');
                                return (
                                    <Link key={item.name} href={item.href} className={menuClasses(isActive)} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <item.icon size={18} />
                                        </div>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-6 border-t border-slate-100">
                            <Link
                                href={`${basePath}/logout`}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-4 py-3.5 w-full text-[13px] font-bold text-slate-600 bg-slate-50 rounded-2xl transition-all"
                            >
                                <LogOut size={18} />
                                Keluar Akun
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
