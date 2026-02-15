"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    ChevronRight,
    Copy,
    CheckCircle2,
    Wallet,
    CreditCard,
    Phone,
    ReceiptText,
    Truck,
    ShieldCheck,
    Info,
    ArrowLeft,
    Loader2,
    ExternalLink
} from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"vodafone" | "instapay">("vodafone");
    const [senderNumber, setSenderNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const data = localStorage.getItem('currentOrder');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setOrderData(parsed);
                setIsLoading(false);
            } catch (e) {
                console.error("Failed to parse order data", e);
                router.push("/dashboard/new");
            }
        } else {
            router.push("/dashboard/new");
        }
    }, [router]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (senderNumber.length !== 11) {
            alert("يرجى إدخال رقم هاتف صحيح مكون من 11 رقم");
            return;
        }

        // In a real app, this would hit an API
        console.log("Final Submission:", {
            ...orderData,
            paymentMethod,
            senderNumber,
            notes
        });

        alert("تم استلام طلبك وبانتظار مراجعة التحويل. شكراً لثقتك!");
        localStorage.removeItem('currentOrder');
        router.push("/dashboard");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    if (!orderData) return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header showLogout={true} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8 text-right" dir="rtl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group hover:bg-green-50 text-green-700"
                >
                    <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                    العودة للتعديل
                </Button>

                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* Left Column: Invoice (3/5) */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white relative">
                            {/* Decorative Invoice Top */}
                            <div className="h-4 bg-green-600 w-full"></div>
                            <div className="absolute top-4 left-0 right-0 h-4 flex justify-around px-4">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-3 h-3 bg-slate-50 rounded-full -mt-1.5"></div>
                                ))}
                            </div>

                            <CardHeader className="pt-12 pb-6 px-8 flex flex-row justify-between items-center bg-green-50/30">
                                <div>
                                    <h1 className="text-3xl font-black text-green-900">فاتورة الدفع</h1>
                                    <p className="text-muted-foreground font-bold mt-1">كود الطلب: <span className="text-green-700 font-black">#{orderData.orderId}</span></p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-100">
                                    <ReceiptText className="w-10 h-10 text-green-600" />
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                {/* Items Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="border-b-2 border-slate-100 text-slate-500 font-bold text-sm">
                                                <th className="pb-4 pr-2">البند</th>
                                                <th className="pb-4 text-center">الحساب</th>
                                                <th className="pb-4 pl-2 text-left">المجموع</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {orderData.items.map((item: any) => (
                                                <tr key={item.id} className="group">
                                                    <td className="py-5 pr-2">
                                                        <p className="font-black text-green-900 group-hover:text-green-600 transition-colors uppercase">
                                                            {item.type === 'document' ? item.fileNames[0] : `${item.fileNames.length} صور`}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                                                            {item.settings.color === 'bw' ? 'أبيض وأسود' : `ألوان (${item.settings.inkType === 'laser' ? 'ليزر' : 'مائي'})`}
                                                            {item.settings.pagesPerSheet > 1 && ` - ${item.settings.pagesPerSheet} صفحات/ورقة`}
                                                            {` - ${item.settings.sides === 'single' ? 'وجه واحد' : 'وجهين'}`}
                                                            {item.settings.rangeType === 'custom' && ` - النطاق (${item.settings.rangeFrom} إلى ${item.settings.rangeTo})`}
                                                        </p>
                                                        {item.settings.notes && (
                                                            <div className="mt-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100/50 flex items-start gap-1.5 max-w-[250px]">
                                                                <Info className="w-3 h-3 text-yellow-600 shrink-0 mt-0.5" />
                                                                <p className="text-[9px] text-yellow-800 leading-tight font-bold italic line-clamp-2">
                                                                    "{item.settings.notes}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-5 text-center">
                                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                            {item.priceDetails.effectivePages || item.settings.pageCount} ص × {item.priceDetails.rate.toFixed(1)} ج × {item.settings.quantity} ن
                                                        </span>
                                                    </td>
                                                    <td className="py-5 pl-2 text-left">
                                                        <span className="font-black text-green-700">{item.priceDetails.total.toFixed(2)} ج.م</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Divider */}
                                <div className="border-t-2 border-dashed border-slate-100 py-6 space-y-3">
                                    <div className="flex justify-between items-center text-slate-500 font-bold">
                                        <span>إجمالي المطبوعات:</span>
                                        <span>{orderData.subtotal.toFixed(2)} ج.م</span>
                                    </div>
                                    {orderData.deliveryFee > 0 && (
                                        <div className="flex justify-between items-center text-slate-500 font-bold">
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-4 h-4" />
                                                <span>رسوم التوصيل ({orderData.delivery === 'home' ? 'توصيل للمنزل' : 'استلام'}):</span>
                                            </div>
                                            <span>{orderData.deliveryFee.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                </div>

                                {/* Grand Total Section */}
                                <div className="bg-green-600 rounded-3xl p-6 text-white flex justify-between items-end shadow-xl shadow-green-100">
                                    <div>
                                        <p className="text-sm font-bold opacity-80 mb-1">المبلغ الإجمالي المستحق</p>
                                        <p className="text-5xl font-black">{orderData.grandTotal.toFixed(1)} <span className="text-xl">ج.م</span></p>
                                    </div>
                                    <ShieldCheck className="w-16 h-16 opacity-20" />
                                </div>

                                <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                    <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-800 leading-normal font-bold">
                                        يرجى تحويل المبلغ بدقة المذكورة أعلاه. سيتم البدء في الطباعة فور مراجعة العملية وتأكيد وصول المبلغ.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment (2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 text-center">
                                <CardTitle className="text-2xl font-black text-green-900">وسيلة الدفع</CardTitle>
                                <p className="text-sm text-slate-500 font-bold mt-2">اختر الطريقة التي قمت بالتحويل بها</p>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {/* Payment Tabs */}
                                <div className="flex p-2 bg-slate-100 rounded-2xl gap-2">
                                    <button
                                        onClick={() => setPaymentMethod("vodafone")}
                                        className={`flex-1 py-4 px-2 rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === "vodafone" ? "bg-white text-red-600 shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        <Wallet className="w-6 h-6" />
                                        <span className="font-black text-[10px]">فودافون كاش</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod("instapay")}
                                        className={`flex-1 py-4 px-2 rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === "instapay" ? "bg-white text-indigo-600 shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="font-black text-[10px]">إنستا باي</span>
                                    </button>
                                </div>

                                {/* Numbers to Copy */}
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold text-slate-500 block">حول المبلغ للرقم التالي:</Label>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="font-black text-lg tracking-wider text-slate-700">01220009065</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full transition-all ${copied === "01220009065" ? "text-green-600 bg-green-50" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`}
                                                onClick={() => handleCopy("01220009065", "01220009065")}
                                            >
                                                {copied === "01220009065" ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {paymentMethod === "instapay" && (
                                        <Button
                                            asChild
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-6 rounded-2xl shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-3 mt-4 text-sm"
                                        >
                                            <a href="https://ipn.eg/S/bmasr3mno3man/instapay/7XU1dI" target="_blank" rel="noopener noreferrer">
                                                <span>ادفع الآن عبر تطبيق إنستاباي</span>
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </Button>
                                    )}
                                </div>

                                {/* Verification Form */}
                                <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-slate-100">
                                    <div className="space-y-3">
                                        <Label className="text-base font-black text-green-900">رقم المحفظة المحول منها</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                            <Input
                                                type="text"
                                                maxLength={11}
                                                placeholder="مثلاً: 010xxxxxxxx"
                                                value={senderNumber}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderNumber(e.target.value.replace(/[^0-9]/g, ""))}
                                                className="h-14 pr-12 text-lg font-bold rounded-2xl border-slate-200 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold">يجب إدخال الـ 11 رقم الخاصين بالمحفظة للتأكد من العملية</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-base font-black text-green-900">ملاحظات التحويل (اختياري)</Label>
                                        <Textarea
                                            placeholder="أضف أي تفاصيل أخرى تخص عملية الدفع هنا..."
                                            value={notes}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                                            className="rounded-2xl border-slate-200 focus:ring-green-500 min-h-[100px] h-auto p-4"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xl py-8 rounded-[1.5rem] shadow-xl shadow-green-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
                                    >
                                        <span>تأكيد الدفع وإرسال الطلب</span>
                                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
