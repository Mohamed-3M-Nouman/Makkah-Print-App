"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfilePage() {
    // Mock Data for the user
    const [name, setName] = useState("محمد أحمد");
    const [email] = useState("mohamed.ahmed@example.com"); // Email is read-only
    const [phone, setPhone] = useState("01115503050");
    const [address, setAddress] = useState("ميدان سرور، دمياط");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving Changes:", { name, phone, address });
        alert("تم حفظ التعديلات بنجاح!");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-yellow-50">
            <Header showLogout={true} userName={name} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <Card className="border-t-4 border-green-600 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-700">إعدادات الحساب</CardTitle>
                        <CardDescription>هنا يمكنك تحديث معلوماتك الشخصية</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-green-700 font-semibold">
                                    الاسم بالكامل
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-right"
                                    required
                                />
                            </div>

                            {/* Email (Read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-green-700 font-semibold">
                                    البريد الإلكتروني
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="text-right bg-gray-50 cursor-not-allowed opacity-70"
                                />
                                <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني حالياً</p>
                            </div>

                            {/* Phone Number with WhatsApp indicator */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-green-700 font-semibold flex items-center gap-2">
                                    <span>رقم الهاتف</span>
                                    <div className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <span>واتساب</span>
                                    </div>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    dir="ltr"
                                    className="text-left w-full"
                                    maxLength={11}
                                />
                            </div>

                            {/* Address (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-green-700 font-semibold flex items-center gap-1">
                                    العنوان
                                    <span className="text-xs text-muted-foreground font-normal">(اختياري)</span>
                                </Label>
                                <textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="أدخل عنوان السكن بالتفصيل"
                                    rows={4}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-12"
                                >
                                    حفظ التعديلات
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
