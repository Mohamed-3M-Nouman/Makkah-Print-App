"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API Call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);

            // Optional: Redirect to login after a delay
            setTimeout(() => {
                router.push("/");
            }, 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-yellow-50">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block transform transition-transform hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="مركز مكة للطباعة"
                            width={120}
                            height={120}
                            className="rounded-lg shadow-lg mb-4 mx-auto"
                        />
                    </Link>
                    <h1 className="text-3xl font-bold text-green-700 mb-2">
                        مركز مكة للطباعة
                    </h1>
                </div>

                <Card className="w-full max-w-md shadow-2xl border-t-4 border-green-600 animate-in fade-in zoom-in duration-500">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold text-green-700">
                            نسيت كلمة المرور؟
                        </CardTitle>
                        {!isSubmitted && (
                            <CardDescription className="text-base">
                                لا تقلق، أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة تعيين كلمة المرور.
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 text-right">
                                    <Label htmlFor="email" className="font-bold text-slate-700 block pr-1">
                                        البريد الإلكتروني
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="text-right h-12 rounded-xl focus:ring-green-500"
                                        dir="ltr"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-lg font-black bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 transition-all rounded-xl"
                                >
                                    {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                                </Button>
                            </form>
                        ) : (
                            <div className="py-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-800">تم الإرسال بنجاح!</h3>
                                    <p className="text-slate-600 font-medium">
                                        تحقق من بريدك الإلكتروني <strong>{email}</strong> للحصول على الرابط.
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400">سيتم توجيهك لصفحة الدخول تلقائياً خلال ثوانٍ...</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-black transition-colors group"
                            >
                                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span>تذكرت كلمة المرور؟ تسجيل الدخول</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}
