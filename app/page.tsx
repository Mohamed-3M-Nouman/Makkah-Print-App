"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

import { login, signup } from "@/app/auth/actions";
import { AlertCircle, Loader2 } from "lucide-react";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePhone = (phoneNumber: string): boolean => {
    // Egyptian phone number validation: 11 digits starting with 010, 011, 012, or 015
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setError(null);
    setIsLoading(true);

    try {
      // Validate phone number for signup
      if (!isLogin && !validatePhone(phone)) {
        setPhoneError("يجب أن يكون رقم الهاتف 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      if (!isLogin) {
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);
      }

      const result = isLogin ? await login(formData) : await signup(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("حدث خطأ ما، يرجى المحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-yellow-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="مركز مكة للطباعة"
              width={150}
              height={150}
              className="rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-green-700 mb-3">
            مركز مكة للطباعة
          </h1>
          <p className="text-lg md:text-2xl text-yellow-700 font-semibold">
            دقة في الألوان وسرعة في التنفيذ
          </p>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-t-4 border-green-600">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-green-700">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin ? "مرحباً بعودتك" : "انضم إلى عائلة مكة"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{error === 'Invalid login credentials' ? 'بريد إلكتروني أو كلمة مرور غير صحيحة' : error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Field - Always visible */}
              <div className="space-y-2 text-right">
                <Label htmlFor="phone" className="flex items-center gap-1 justify-end">
                  رقم الهاتف
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError("");
                  }}
                  required
                  dir="ltr"
                  className="text-left w-full h-12 rounded-xl"
                  maxLength={11}
                />
                {!isLogin && (
                  <p className="text-[10px] text-muted-foreground pr-1">
                    يفضل رقم عليه واتساب للتواصل
                  </p>
                )}
                {phoneError && (
                  <p className="text-xs text-red-500 font-bold pr-1">{phoneError}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="name" className="flex items-center gap-1 justify-end">
                      الاسم الكامل
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-right w-full h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="email" className="flex items-center gap-1 justify-end">
                      البريد الإلكتروني
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-right w-full h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="address" className="flex items-center gap-1 justify-end">
                      العنوان
                      <span className="text-[10px] text-muted-foreground">(اختياري)</span>
                    </Label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="أدخل عنوانك الكامل (إذا كنت تفضل التوصيل للمنزل)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2 text-right">
                <Label htmlFor="password" className="flex items-center gap-1 justify-end">
                  كلمة المرور
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right w-full h-12 rounded-xl"
                />
                {isLogin && (
                  <div className="text-left">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-green-700 hover:text-green-800 hover:underline font-bold"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-lg font-black h-12 rounded-xl bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التحميل...</span>
                  </div>
                ) : (
                  isLogin ? "تسجيل الدخول" : "إنشاء حساب"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-700 hover:underline font-medium"
              >
                {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل الدخول"}
              </button>
            </div>

            {/* Client-Only: Admin access moved to separate project */}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
