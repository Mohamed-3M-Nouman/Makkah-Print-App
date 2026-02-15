"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOrders, OrderItem } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    FileText,
    Image as ImageIcon,
    Printer,
    ShoppingBag,
    Palette,
    Clock,
    ArrowLeft,
    Wallet,
    GraduationCap
} from "lucide-react";

const statusColors: Record<string, string> = {
    pending_review: "bg-orange-400 hover:bg-orange-500",
    confirmed: "bg-blue-500 hover:bg-blue-600",
    printing: "bg-indigo-600 hover:bg-indigo-700",
    completed: "bg-cyan-600 hover:bg-cyan-700",
    out_for_delivery: "bg-orange-600 hover:bg-orange-700",
    delivered: "bg-green-600 hover:bg-green-700",
};

const statusLabels: Record<string, string> = {
    pending_review: "قيد المراجعة",
    confirmed: "تم تأكيد الطلب",
    printing: "جاري الطباعة",
    completed: "تم الانتهاء من الطباعة",
    out_for_delivery: "جاري التوصيل",
    delivered: "تم الاستلام",
};

// --- Sub-components for Scalability ---

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    colorClass: string;
}

function ServiceCard({ title, description, icon, isActive = true, onClick, colorClass }: ServiceCardProps) {
    return (
        <Card
            className={`relative overflow-hidden group transition-all duration-300 ${isActive ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 active:scale-95 border-none' : 'opacity-70 grayscale bg-slate-50 border-dashed border-2'}`}
            onClick={isActive ? onClick : undefined}
        >
            <CardContent className="p-6 text-right" dir="rtl">
                <div className={`p-4 rounded-2xl w-fit mb-4 transition-colors ${isActive ? colorClass : 'bg-slate-200 text-slate-400'}`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <h3 className={`text-xl font-black ${isActive ? 'text-green-900' : 'text-slate-500'}`}>{title}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{description}</p>
                </div>

                {isActive ? (
                    <div className="mt-4 flex items-center text-green-600 font-bold text-sm">
                        <span>ابدأ الآن</span>
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    </div>
                ) : (
                    <Badge variant="secondary" className="mt-4 bg-slate-200 text-slate-500 border-none font-black text-[10px]">قريباً</Badge>
                )}

                {isActive && (
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-current opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700" />
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    // Show only 3 recent orders for the hub view
    const recentOrders = mockOrders.slice(0, 3);

    const formatItemName = (item: OrderItem) => {
        if (item.type === "document") return item.fileName as string;
        return `${(item.fileName as string[]).length} صور`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-blue-50/30">
            <Header showLogout={true} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-12 text-right" dir="rtl">

                {/* Header: Welcome & Wallet */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-green-900">أهلاً بك، أحمد! 👋</h1>
                        <p className="text-slate-500 text-lg font-medium">ماذا تود أن نفعل لك اليوم؟</p>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-green-50 flex items-center gap-5 min-w-[240px]">
                        <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 mb-1 leading-none uppercase">رصيد المحفظة</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-green-600 leading-none">125.50</span>
                                <span className="text-sm font-bold text-green-800">ج.م</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section A: Service Launcher */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                        <h2 className="text-2xl font-black text-green-900">خدماتنا المميزة</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ServiceCard
                            title="طباعة مستندات"
                            description="اطبع ملفاتك PDF و Word بأعلى جودة وتوصيل سريع."
                            icon={<Printer className="w-8 h-8" />}
                            isActive={true}
                            colorClass="bg-green-100 text-green-600"
                            onClick={() => router.push("/home/new")}
                        />
                        <ServiceCard
                            title="الأدوات المدرسية"
                            description="جميع مستلزمات الدراسة والقرطاسية في مكان واحد."
                            icon={<GraduationCap className="w-8 h-8" />}
                            isActive={false}
                            colorClass="bg-blue-100 text-blue-600"
                        />
                        <ServiceCard
                            title="خدمات التصميم"
                            description="تصميم كروت شخصية، فلايرز، وبروفايل شركات."
                            icon={<Palette className="w-8 h-8" />}
                            isActive={false}
                            colorClass="bg-yellow-100 text-yellow-600"
                        />
                        <ServiceCard
                            title="المتجر المتنوع"
                            description="هدايا، ألعاب، وإكسسوارات مكتبية مميزة."
                            icon={<ShoppingBag className="w-8 h-8" />}
                            isActive={false}
                            colorClass="bg-purple-100 text-purple-600"
                        />
                    </div>
                </section>

                {/* Section B: Active Orders (Conditional) */}
                {(() => {
                    const activeOrders = mockOrders.filter(order => !['completed', 'delivered', 'cancelled'].includes(order.status));

                    if (activeOrders.length === 0) return null;

                    return (
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </div>
                                <h2 className="text-2xl font-black text-green-900">الطلبات الحالية</h2>
                            </div>

                            <div className="flex overflow-x-auto snap-x gap-4 py-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
                                {activeOrders.map((order) => (
                                    <Card
                                        key={order.id}
                                        className="min-w-[85vw] sm:min-w-0 snap-center border-none shadow-lg rounded-[2rem] bg-white border-r-4 border-r-green-500 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                                        onClick={() => router.push(`/orders/${order.id}`)}
                                    >
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-xl text-slate-800">طلب #{order.id}</span>
                                                        <div className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">
                                                            جاري التنفيذ
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 font-bold">{order.date}</p>
                                                </div>
                                                <Badge className={`${statusColors[order.status]} text-white border-none shadow-sm rounded-xl px-3 py-1`}>
                                                    {statusLabels[order.status]}
                                                </Badge>
                                            </div>

                                            <div className="py-3 border-t border-dashed border-slate-100 space-y-2">
                                                {order.items.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                                                        {item.type === "document" ? <FileText className="w-4 h-4 text-green-500" /> : <ImageIcon className="w-4 h-4 text-green-500" />}
                                                        <span className="truncate">{formatItemName(item)}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <p className="text-xs text-slate-400 font-bold mr-6">+ {order.items.length - 2} عناصر أخرى</p>
                                                )}
                                            </div>

                                            <Button
                                                className="w-full bg-slate-50 hover:bg-green-50 text-green-700 font-black rounded-xl h-10 shadow-sm border border-slate-100 hover:border-green-200 transition-colors"
                                            >
                                                تتبع الطلب
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    );
                })()}

                {/* Section C: Recent Activity */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-yellow-500 rounded-full" />
                            <h2 className="text-2xl font-black text-green-900">آخر النشاطات</h2>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-green-600 font-black hover:bg-green-50 px-6 rounded-2xl h-12"
                            onClick={() => router.push('/orders')}
                        >
                            عرض كل الطلبات
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="border-none shadow-lg rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all cursor-pointer bg-white"
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl text-white ${statusColors[order.status] || 'bg-slate-400'}`}>
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="font-black text-slate-800">طلب #{order.id}</span>
                                        </div>
                                        <Badge className={`${statusColors[order.status] || "bg-gray-500"} text-white border-none shadow-sm rounded-lg px-3`}>
                                            {statusLabels[order.status] || order.status}
                                        </Badge>
                                    </div>

                                    <div className="py-2 border-y border-dashed border-slate-100 flex flex-col gap-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                                                {item.type === "document" ? <FileText className="w-4 h-4 text-green-600" /> : <ImageIcon className="w-4 h-4 text-green-600" />}
                                                <span className="truncate flex-1">{formatItemName(item)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center text-xs pt-1">
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 font-bold">تاريخ الطلب</span>
                                            <span className="text-slate-700 font-black">{order.date}</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-slate-400 font-bold">طريقة الاستلام</p>
                                            <p className="font-black text-green-700">{order.delivery === "pickup" ? "استلام محلي" : "توصيل منزل"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
