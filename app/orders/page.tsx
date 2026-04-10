"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOrders, Order, OrderItem } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    FileText,
    Image as ImageIcon,
    Clock,
    ChevronLeft,
    LayoutGrid,
    Printer,
    ShoppingBag,
    Palette,
    Search,
    Filter,
    Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
    completed: "تم الانتهاء",
    out_for_delivery: "في الطريق",
    delivered: "تم الاستلام",
};

const serviceIcons: Record<string, React.ReactNode> = {
    print: <Printer className="w-5 h-5" />,
    stationery: <ShoppingBag className="w-5 h-5" />,
    design: <Palette className="w-5 h-5" />,
};

const serviceLabels: Record<string, string> = {
    print: "طباعة",
    stationery: "أدوات",
    design: "تصميم",
};

export default function OrdersHistoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'print' | 'stationery' | 'design'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrders = useMemo(() => {
        return mockOrders.filter(order => {
            const matchesService = activeTab === 'all' || order.serviceType === activeTab;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && !['delivered', 'completed'].includes(order.status)) ||
                (statusFilter === 'completed' && ['delivered', 'completed'].includes(order.status));
            return matchesService && matchesStatus;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [activeTab, statusFilter]);

    const formatItemName = (item: OrderItem) => {
        if (typeof item.fileName === "string") return item.fileName;
        return `${item.fileName.length} صور`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-blue-50/30">
            <Header showLogout={true} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-8 text-right" dir="rtl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600 mb-2 cursor-pointer hover:gap-3 transition-all" onClick={() => router.push('/home')}>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-bold">العودة للرئيسية</span>
                        </div>
                        <h1 className="text-4xl font-black text-green-900">سجل الطلبات</h1>
                        <p className="text-slate-500 font-medium">عرض وإدارة جميع طلباتك السابقة والحالية</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            placeholder="بحث برقم الطلب..."
                            className="bg-white border-green-100 h-12 rounded-2xl pr-12 text-lg font-medium shadow-sm focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-6">
                    {/* Service Tabs */}
                    <div className="flex flex-wrap items-center gap-3 p-1.5 bg-white/50 backdrop-blur-md border border-white rounded-[2rem] w-fit shadow-sm">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-3 rounded-[1.5rem] font-black transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                            الكل
                        </button>
                        <button
                            onClick={() => setActiveTab('print')}
                            className={`px-6 py-3 rounded-[1.5rem] font-black transition-all flex items-center gap-2 ${activeTab === 'print' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                        >
                            <Printer className="w-5 h-5" />
                            طباعة
                        </button>
                        <button
                            disabled
                            title="هذه الخدمة ستتوفر قريباً"
                            className="px-6 py-3 rounded-[1.5rem] font-black transition-all flex items-center gap-2 text-slate-400 bg-slate-100 opacity-60 cursor-not-allowed"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            أدوات (قريباً)
                        </button>
                        <button
                            disabled
                            title="هذه الخدمة ستتوفر قريباً"
                            className="px-6 py-3 rounded-[1.5rem] font-black transition-all flex items-center gap-2 text-slate-400 bg-slate-100 opacity-60 cursor-not-allowed"
                        >
                            <Palette className="w-5 h-5" />
                            تصميم (قريباً)
                        </button>
                    </div>

                    {/* Sub-filters (Status) */}
                    <div className="flex items-center gap-4 text-sm overflow-x-auto pb-2 scrollbar-hide">

                        {[
                            { id: 'all', label: 'الكل' },
                            { id: 'active', label: 'طلبات نشطة' },
                            { id: 'completed', label: 'مكتملة' }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                                className={`px-4 py-2 rounded-xl font-bold border transition-all whitespace-nowrap ${statusFilter === filter.id ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-500 hover:border-green-100'}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Grid */}
                {filteredOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all cursor-pointer bg-white"
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <CardContent className="p-8 space-y-6">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100`}>
                                                {serviceIcons[order.serviceType]}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-xl text-slate-900 leading-none">طلب #{order.id}</p>
                                                <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 font-bold px-2 py-0 text-[10px]">
                                                    {serviceLabels[order.serviceType]}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Badge className={`${statusColors[order.status] || "bg-gray-500"} border shadow-sm rounded-xl px-4 py-1.5 font-bold`}>
                                            {statusLabels[order.status] || order.status}
                                        </Badge>
                                    </div>

                                    {/* Items List */}
                                    <div className="py-4 border-y border-dashed border-slate-100 space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-lg font-bold text-slate-700">
                                                    {item.type === "document" ? <FileText className="w-5 h-5 text-green-600" /> : <ImageIcon className="w-5 h-5 text-green-600" />}
                                                    <span className="truncate max-w-[200px]">{formatItemName(item)}</span>
                                                </div>
                                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-black">
                                                    {item.quantity} نسخ
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer Details */}
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="flex gap-6">
                                            <div className="space-y-1">
                                                <p className="text-slate-400 text-xs font-bold leading-none uppercase">التاريخ</p>
                                                <div className="flex items-center gap-1.5 font-black text-slate-700 mt-1">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {order.date}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-400 text-xs font-bold leading-none uppercase">الاستلام</p>
                                                <p className="font-black text-green-700 mt-1">{order.delivery === "pickup" ? "استلام محلي" : "توصيل منزل"}</p>
                                            </div>
                                        </div>

                                        {order.totalPrice && (
                                            <div className="text-left">
                                                <p className="text-slate-400 text-xs font-bold leading-none uppercase mb-1">الإجمالي</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-green-600">{order.totalPrice.toFixed(2)}</span>
                                                    <span className="text-xs font-bold text-green-800">ج.م</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6 bg-white/50 rounded-[3rem] border border-dashed border-slate-200 backdrop-blur-sm">
                        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Clock className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-800">لا توجد طلبات</h3>
                            <p className="text-slate-500 font-medium">لم نجد أي طلبات تطابق اختياراتك الحالية.</p>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-full px-8 h-12 border-green-200 text-green-700 hover:bg-green-100"
                            onClick={() => { setActiveTab('all'); setStatusFilter('all'); }}
                        >
                            إعادة ضبط التصفية
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
