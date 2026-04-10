"use client";

import { useState } from "react";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
    const [pricing, setPricing] = useState(PRICING_CONFIG);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const handlePricingSave = () => {
        // TODO: Send updated pricing to Supabase database
        alert("تم حفظ أسعار الطباعة بنجاح!");
    };

    const handlePasswordSave = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            alert("يرجى ملء جميع الحقول.");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            alert("كلمة المرور الجديدة غير متطابقة.");
            return;
        }
        alert("تم تحديث كلمة المرور بنجاح!");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
            <div className="mb-8 text-right">
                <h1 className="text-3xl font-black text-slate-900">الإعدادات العامة</h1>
                <p className="text-slate-500 font-bold mt-1">إدارة تسعير النظام والأمان</p>
            </div>

            <Tabs defaultValue="pricing" className="space-y-6" dir="rtl">
                <TabsList className="bg-slate-200/50 p-1 rounded-xl h-auto flex flex-row w-full sm:w-auto self-start border border-slate-200">
                    <TabsTrigger value="pricing" className="flex-1 sm:flex-none text-base font-bold rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm">تبويب الأسعار</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 sm:flex-none text-base font-bold rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm">الأمان والحساب</TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="focus:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Black and White */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-100/50 border-b border-slate-100 pb-4 items-start text-right">
                                <CardTitle className="text-lg font-black text-slate-800">أبيض وأسود</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجه واحد (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.bw.single} 
                                        onChange={e => setPricing({...pricing, bw: {...pricing.bw, single: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left" 
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجهين (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.bw.double} 
                                        onChange={e => setPricing({...pricing, bw: {...pricing.bw, double: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left" 
                                        dir="ltr"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Color Inkjet */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4 items-start text-right">
                                <CardTitle className="text-lg font-black text-indigo-800">ألوان (مائي / انكجيت)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجه واحد (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.color_inkjet.single} 
                                        onChange={e => setPricing({...pricing, color_inkjet: {...pricing.color_inkjet, single: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left focus:border-indigo-500 focus:ring-indigo-500" 
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجهين (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.color_inkjet.double} 
                                        onChange={e => setPricing({...pricing, color_inkjet: {...pricing.color_inkjet, double: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left focus:border-indigo-500 focus:ring-indigo-500" 
                                        dir="ltr"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Color Laser */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-purple-50/50 border-b border-purple-100/50 pb-4 items-start text-right">
                                <CardTitle className="text-lg font-black text-purple-800">ألوان (ليزر)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجه واحد (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.color_laser.single} 
                                        onChange={e => setPricing({...pricing, color_laser: {...pricing.color_laser, single: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left focus:border-purple-500 focus:ring-purple-500" 
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">وجهين (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        value={pricing.color_laser.double} 
                                        onChange={e => setPricing({...pricing, color_laser: {...pricing.color_laser, double: parseFloat(e.target.value)}})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left focus:border-purple-500 focus:ring-purple-500" 
                                        dir="ltr"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-orange-50/50 border-b border-orange-100/50 pb-4 items-start text-right">
                                <CardTitle className="text-lg font-black text-orange-800">رسوم التوصيل</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2 text-right">
                                    <Label className="font-bold text-slate-700">السعر الثابت للتوصيل للمنزل (ج.م)</Label>
                                    <Input 
                                        type="number" 
                                        step="1" 
                                        value={pricing.delivery} 
                                        onChange={e => setPricing({...pricing, delivery: parseFloat(e.target.value)})} 
                                        className="h-12 bg-slate-50 rounded-xl font-mono text-lg font-bold text-left focus:border-orange-500 focus:ring-orange-500" 
                                        dir="ltr"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={handlePricingSave} className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 rounded-xl text-lg shadow-lg">
                            <Save className="w-5 h-5 ml-2" />
                            حفظ التعديلات
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="focus:outline-none">
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden max-w-md">
                        <CardHeader className="bg-slate-100/50 border-b border-slate-100 pb-4 items-start text-right">
                            <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-slate-500" />
                                تغيير كلمة المرور
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2 text-right">
                                <Label className="font-bold text-slate-700">كلمة المرور الحالية</Label>
                                <Input 
                                    type="password" 
                                    value={passwords.current} 
                                    onChange={e => setPasswords({...passwords, current: e.target.value})} 
                                    className="h-12 bg-slate-50 rounded-xl font-mono text-left" 
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <Label className="font-bold text-slate-700">كلمة المرور الجديدة</Label>
                                <Input 
                                    type="password" 
                                    value={passwords.new} 
                                    onChange={e => setPasswords({...passwords, new: e.target.value})} 
                                    className="h-12 bg-slate-50 rounded-xl font-mono text-left" 
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <Label className="font-bold text-slate-700">تأكيد كلمة المرور الجديدة</Label>
                                <Input 
                                    type="password" 
                                    value={passwords.confirm} 
                                    onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                                    className="h-12 bg-slate-50 rounded-xl font-mono text-left" 
                                    dir="ltr"
                                />
                            </div>
                            
                            <Button onClick={handlePasswordSave} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl text-lg mt-4 shadow-md">
                                تحديث كلمة المرور
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
