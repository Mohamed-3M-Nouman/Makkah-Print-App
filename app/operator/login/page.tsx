"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OperatorLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push('/operator/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <Image
                            src="/logo.png"
                            alt="Makaa Printing"
                            fill
                            className="object-contain drop-shadow-xl"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">مركز مكة للطباعة</h1>
                    <p className="text-slate-500 font-medium">لوحة تحكم الموظفين</p>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center bg-slate-50/50 pb-8 border-b border-slate-100">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2 text-green-600">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">تسجيل الدخول</h2>
                        <p className="text-sm text-slate-400">أدخل بيانات الحساب للمتابعة</p>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-bold text-slate-700">اسم المستخدم أو البريد</Label>
                                <div className="relative">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="username"
                                        placeholder="user@makaa.com"
                                        className="h-12 pr-10 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-slate-50/50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold text-slate-700">كلمة المرور</Label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-12 pr-10 pl-10 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-slate-50/50"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 rounded-md w-5 h-5" />
                                <Label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">تذكرني على هذا الجهاز</Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        جاري الدخول...
                                    </span>
                                ) : "تسجيل الدخول"}
                            </Button>
                        </form>

                        <div className="text-center pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400 font-medium">
                                نظام إدارة الطلبات v2.0 • جميع الحقوق محفوظة
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
