import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Lock, Mail, ArrowRight, ShieldCheck,
    Loader2, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/Components/ui';
import { Input, Label } from '@/Components/ui/Forms';

// Sub-component untuk Background agar kode utama bersih
export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
            <Head title="Login | Asaindo Absensi" />

            <div className="w-full max-w-[900px] flex bg-white rounded-2xl shadow-premium border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-500">

                {/* Visual Side (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden p-2">
                                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Asaindo<span className="opacity-80 ml-1">Absensi</span>
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
                            Human Resource <br />
                            <span className="text-indigo-100">Excellence.</span>
                        </h2>
                        <p className="text-white/80 text-base font-medium max-w-xs">
                            Sistem manajemen SDM terintegrasi untuk efisiensi dan transparansi kerja.
                        </p>
                    </div>

                    <div className="relative z-10 flex justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/10">
                        <span>HRM Platform</span>
                        <span>v3.0</span>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex-1 p-8 lg:p-14 flex flex-col justify-center bg-white">
                    <div className="max-w-sm mx-auto w-full space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h3>
                            <p className="text-slate-500 text-sm mt-1">Silakan masuk ke akun administrator Anda</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                                    Email Administrator
                                </Label>
                                <div className="relative group">
                                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@asaindo.id"
                                        className={`h-12 bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900 pl-10 rounded-xl transition-all ${errors.email && 'border-red-300'}`}
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-slate-600 text-[11px] font-bold uppercase tracking-wider">Password</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="h-12 bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900 pl-10 pr-10 rounded-xl"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-medium mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2 px-0.5">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <Label htmlFor="remember" className="text-slate-500 text-xs cursor-pointer hover:text-slate-700 transition-colors">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <div className="pt-2">
                                <Button
                                    className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] text-sm font-bold rounded-xl shadow-md transition-all duration-200"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>MASUK SEKARANG</span>
                                            <ArrowRight size={18} />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="pt-6 text-center">
                            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                                &copy; 2026 Asaindo Absensi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}