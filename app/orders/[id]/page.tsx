"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getMockOrderById, OrderStatus } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    ArrowRight,
    Calendar,
    CreditCard,
    Truck,
    FileText,
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    AlertCircle,
    MapPin,
    Wallet
} from "lucide-react";

const statusColors: Record<string, string> = {
    pending_review: "bg-orange-100 text-orange-700 border-orange-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    printing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    completed: "bg-cyan-100 text-cyan-700 border-cyan-200",
    out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels: Record<string, string> = {
    pending_review: "قيد المراجعة",
    confirmed: "تم تأكيد الطلب",
    printing: "جاري الطباعة",
    completed: "جاهز للاستلام/التوصيل",
    out_for_delivery: "في الطريق إليك",
    delivered: "تم التسليم بنجاح",
};

const timelineSteps = [
    { key: "pending_review", label: "تم استلام الطلب" },
    { key: "confirmed", label: "تم التأكيد" },
    { key: "printing", label: "جاري التنفيذ" },
    { key: "completed", label: "جاهز" },
    { key: "delivered", label: "تم الاستلام" },
];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const order = getMockOrderById(parseInt(id));

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header showLogout={true} />
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-4 max-w-md">
                        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
                        <h1 className="text-3xl font-black text-slate-800">الطلب غير موجود</h1>
                        <p className="text-slate-500 font-medium">عذراً، لم نتمكن من العثور على الطلب رقم #{id} في سجلاتنا.</p>
                        <Button
                            className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 font-bold text-lg shadow-lg"
                            onClick={() => router.push('/orders')}
                        >
                            العودة لسجل الطلبات
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentStepIndex = timelineSteps.findIndex(s => s.key === order.status);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-blue-50/20">
            <Header showLogout={true} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8 text-right" dir="rtl">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-green-600 hover:border-green-100 transition-all"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-green-900">طلب #{order.id}</h1>
                            <p className="text-slate-500 font-medium">عرض تفاصيل وحالة طلبك الحالي</p>
                        </div>
                    </div>
                    <Badge className={`${statusColors[order.status]} border py-2 px-6 rounded-2xl text-base font-black shadow-sm`}>
                        {statusLabels[order.status]}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left/Main Column: Info & Items */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Section A: Order Info Grid */}
                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-black text-slate-400 uppercase leading-none">تاريخ الطلب</p>
                                        <div className="flex items-center gap-2 font-black text-slate-800">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            {order.date}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-black text-slate-400 uppercase leading-none">طريقة الدفع</p>
                                        <div className="flex items-center gap-2 font-black text-slate-800">
                                            {order.paymentMethod === 'wallet' ? <Wallet className="w-4 h-4 text-green-500" /> : <CreditCard className="w-4 h-4 text-green-500" />}
                                            {order.paymentMethod === 'wallet' ? 'محفظة' : 'كاش'}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-black text-slate-400 uppercase leading-none">نوع الاستلام</p>
                                        <div className="flex items-center gap-2 font-black text-slate-800">
                                            {order.delivery === 'home' ? <Truck className="w-4 h-4 text-green-500" /> : <MapPin className="w-4 h-4 text-green-500" />}
                                            {order.delivery === 'home' ? 'توصيل منزل' : 'استلام محلي'}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-black text-slate-400 uppercase leading-none text-left">الإجمالي</p>
                                        <div className="flex items-baseline justify-end gap-1 font-black text-green-600 text-xl">
                                            {order.totalPrice.toFixed(2)}
                                            <span className="text-xs text-green-800">ج.م</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section B: Order Contents */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                                <h2 className="text-2xl font-black text-green-900">محتويات الطلب</h2>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <Card key={idx} className="border-none shadow-lg rounded-[2.5rem] bg-white group hover:shadow-xl transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                                <div className="flex items-center gap-5 flex-1">
                                                    <div className="p-4 bg-green-50 rounded-3xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                                                        {item.type === "document" ? <FileText className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xl font-black text-slate-800 leading-none">
                                                            {Array.isArray(item.fileName) ? `${item.fileName.length} صور` : item.fileName}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] px-2">
                                                                {item.color === 'bw' ? 'أبيض وأسود' : 'ألوان'}
                                                            </Badge>
                                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] px-2">
                                                                {item.sides === 'single' ? 'وجه واحد' : 'وجهين'}
                                                            </Badge>
                                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] px-2">
                                                                {item.quantity} نسخة
                                                            </Badge>
                                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] px-2">
                                                                {item.binding}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.itemPrice && (
                                                    <div className="text-left w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-dashed border-slate-100">
                                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">السعر</p>
                                                        <div className="flex items-baseline justify-end gap-1 font-black text-slate-700 text-lg">
                                                            {item.itemPrice.toFixed(2)}
                                                            <span className="text-xs text-slate-500">ج.م</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {order.notes && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-black text-slate-800 pr-2 italic">ملاحظات العميل</h2>
                                <div className="bg-yellow-50/50 p-6 rounded-[2rem] border-r-4 border-yellow-400 text-slate-600 font-medium text-lg leading-relaxed">
                                    "{order.notes}"
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Tracking Timeline */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            <h2 className="text-2xl font-black text-green-900">تتبع الطلب</h2>
                        </div>

                        <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
                            <CardContent className="p-10">
                                <div className="relative space-y-12">
                                    {/* Timeline Vertical Line */}
                                    <div className="absolute right-5 top-2 bottom-2 w-1.5 bg-slate-100 rounded-full" />

                                    {timelineSteps.map((step, idx) => {
                                        const isCompleted = idx < currentStepIndex || (order.status === 'delivered' && idx === currentStepIndex) || (order.status === 'completed' && idx <= 3);
                                        const isCurrent = (idx === currentStepIndex && order.status !== 'delivered') || (order.status === 'completed' && idx === 3);

                                        return (
                                            <div key={idx} className="relative flex items-center pr-14 group">
                                                {/* Timeline Node */}
                                                <div className={`absolute right-0 w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 
                                                    ${isCompleted ? 'bg-green-600 border-green-100 text-white' :
                                                        isCurrent ? 'bg-blue-600 border-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white scale-125' :
                                                            'bg-white border-slate-100 text-slate-200'}`}
                                                >
                                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isCurrent ? <Clock className="w-6 h-6 animate-pulse" /> : <div className="w-3 h-3 bg-current rounded-full" />}
                                                </div>

                                                <div className="space-y-1">
                                                    <p className={`font-black text-lg transition-colors ${isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-slate-300'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">المرحلة الحالية</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Desk Placeholder */}
                        <div className="bg-green-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-4">
                            <h3 className="text-2xl font-black">تحتاج مساعدة؟</h3>
                            <p className="text-green-100/70 font-medium leading-relaxed">إذا كان لديك أي استفسار حول هذا الطلب، يمكنك التواصل مع الدعم الفني عبر الواتساب.</p>
                            <Button className="w-full h-14 bg-white text-green-900 hover:bg-green-50 rounded-2xl font-black text-lg">
                                تواصل معنا
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
