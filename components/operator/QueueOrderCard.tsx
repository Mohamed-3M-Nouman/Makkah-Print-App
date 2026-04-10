"use client";

import { Download, FileText, Phone, User, Printer, CheckSquare, CheckCircle, AlertCircle, Clock, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/lib/mockData";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending_review: { label: "جديد", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertCircle },
    confirmed: { label: "مؤكد", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
    printing: { label: "جاري الطباعة", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Printer },
    completed: { label: "جاهز للاستلام", color: "bg-green-100 text-green-700 border-green-200", icon: CheckSquare },
    out_for_delivery: { label: "جاري التوصيل", color: "bg-orange-100 text-orange-700 border-orange-200", icon: MapPin },
    delivered: { label: "تم التسليم", color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle },
};

interface QueueOrderCardProps {
    order: Order;
    onUpdateStatus: (id: number, status: OrderStatus) => void;
}

export default function QueueOrderCard({ order, onUpdateStatus }: QueueOrderCardProps) {
    const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;

    // Determine detailed specs for the summary box (taking the first item for simplicity in summary, or aggregating)
    // For this design, we'll show the specs of the first item prominently or iterate if multiple.
    // The prompt asks for a "Specs Box". If multiple items, we might need multiple boxes or a summary.
    // We'll list specs for each item to be accurate.

    const openWhatsApp = () => {
        const message = `مرحباً ${order.customerName || 'عميلنا العزيز'}، بخصوص طلبك رقم #${order.id} من مركز مكة للطباعة...`;
        const url = `https://wa.me/20${order.customerPhone?.replace(/^0/, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col overflow-hidden rounded-2xl group ring-1 ring-slate-100" dir="rtl">
            {/* 1. Header */}
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <Badge className={`${statusConfig[order.status]?.color} px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status]?.label}
                    </Badge>
                    {order.delivery === 'home' && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 font-bold px-2 py-1">
                            <MapPin className="w-3 h-3 ml-1" /> توصيل
                        </Badge>
                    )}
                </div>
                <div className="text-left">
                    <span className="text-2xl font-black text-slate-800 font-mono">#{order.id}</span>
                </div>
            </div>

            <CardContent className="p-6 space-y-6 bg-slate-50/30 flex-1">
                {/* 2. Customer Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{order.customerName || "عميل غير مسجل"}</p>
                            <p className="text-xs text-slate-500 font-mono dir-ltr">{order.customerPhone || "N/A"}</p>
                        </div>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full h-10 w-10"
                        onClick={openWhatsApp}
                        title="تواصل عبر واتساب"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </Button>
                </div>

                {/* 3. Items & Specs Box */}
                <div className="space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-3">
                            {/* High Contrast Specs Box */}
                            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg grid grid-cols-3 gap-2 text-center divide-x divide-x-reverse divide-slate-700">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold mb-1">عدد النسخ</p>
                                    <p className="text-lg font-black text-yellow-400">{item.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold mb-1">نوع الطباعة</p>
                                    <p className="text-lg font-black">{item.color === 'bw' ? 'أبيض وأسود' : 'ألوان'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold mb-1">الورق</p>
                                    <p className="text-lg font-black">{item.sides === 'single' ? 'وجه واحد' : 'وش وضهر'}</p>
                                </div>
                            </div>

                            {/* File Info */}
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-red-50 text-red-600 p-2 rounded-lg shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-slate-700 truncate dir-ltr text-right">
                                            {Array.isArray(item.fileName) ? `${item.fileName.length} ملفات` : item.fileName}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {item.pageCount} صفحة
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold h-9 rounded-lg shrink-0">
                                    <Download className="w-4 h-4 ml-2" />
                                    تحميل
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Staff Actions */}
                <div className="pt-2">
                    {['pending_review', 'confirmed'].includes(order.status) && (
                        <Button
                            className="w-full h-12 text-lg font-black bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl shadow-slate-200 transition-transform active:scale-95"
                            onClick={() => onUpdateStatus(order.id, 'printing')}
                        >
                            <Printer className="w-5 h-5 ml-2" />
                            بدء الطباعة
                        </Button>
                    )}

                    {order.status === 'printing' && (
                        <Button
                            className="w-full h-12 text-lg font-black bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-200 transition-transform active:scale-95 animate-in zoom-in"
                            onClick={() => onUpdateStatus(order.id, 'completed')}
                        >
                            <CheckSquare className="w-5 h-5 ml-2" />
                            جاهز للاستلام
                        </Button>
                    )}

                    {order.status === 'completed' && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center font-bold border border-green-200">
                            ✅ الطلب جاهز وفي انتظار العميل
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
