"use client";

import { useState } from "react";
import { Download, FileText, Printer, CheckSquare, CheckCircle, AlertCircle, MapPin, User, MessageCircle, Eye, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/lib/mockData";
import OrderDetailsSheet from "@/components/operator/OrderDetailsSheet";
import ReceiptDialog from "@/components/operator/ReceiptDialog";

interface OperatorOrderCardProps {
    order: Order;
    onUpdateStatus: (id: number, status: OrderStatus) => void;
}

export default function OperatorOrderCard({ order, onUpdateStatus }: OperatorOrderCardProps) {
    const isNew = order.status === 'pending_review' || order.status === 'confirmed';
    const isPrinting = order.status === 'printing';
    const isCompleted = order.status === 'completed' || order.status === 'out_for_delivery';
    
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const openWhatsApp = () => {
        const message = `مرحباً ${order.customerName || 'عميلنا العزيز'}، بخصوص طلبك رقم #${order.id} من مركز مكة للطباعة...`;
        const url = `https://wa.me/20${order.customerPhone?.replace(/^0/, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
                {/* Header: ID, Delivery, Details Action */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-black text-lg font-mono text-slate-800">#{order.id}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{order.customerName || "عميل غير مسجل"}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {order.delivery === 'home' && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs font-bold px-2 py-0.5">
                                <MapPin className="w-3 h-3 ml-1" /> توصيل
                            </Badge>
                        )}
                        {order.delivery === 'pickup' && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-bold px-2 py-0.5">
                                استلام
                            </Badge>
                        )}
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setIsReceiptOpen(true)} className="h-7 px-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                                <Receipt className="w-3.5 h-3.5 ml-1" /> فاتورة
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsSheetOpen(true)} className="h-7 px-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Eye className="w-3.5 h-3.5 ml-1" /> التفاصيل
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Specs / Items Summary */}
                <div className="space-y-2">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <p className="text-xs font-bold text-slate-700 truncate" title={Array.isArray(item.fileName) ? item.fileName.join(', ') : item.fileName}>
                                    {Array.isArray(item.fileName) ? `${item.fileName.length} ملفات` : item.fileName}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] mt-1">
                                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 font-bold shadow-sm px-2">
                                    {item.color === 'color' ? `ألوان (${item.inkType === 'laser' ? 'ليزر' : 'مائي'})` : 'أبيض وأسود'}
                                </Badge>
                                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 font-bold shadow-sm px-2">
                                    {item.sides === 'double' ? 'وجهين' : 'وجه واحد'} {item.pagesPerSheet ? `(${item.pagesPerSheet} صفحة)` : ''}
                                </Badge>
                                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 font-bold shadow-sm px-2">
                                    نطاق: {item.printRange || 'الكل'}
                                </Badge>
                                <Badge variant="outline" className="bg-white text-slate-900 border-slate-300 font-black shadow-sm px-2">
                                    {item.quantity} نسخ
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dynamic Action Buttons */}
                <div className="mt-auto pt-2 flex flex-col gap-2">
                    {isNew && (
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 transition-all"
                            onClick={() => onUpdateStatus(order.id, 'printing')}
                        >
                            <Printer className="w-4 h-4 ml-2" />
                            بدء التنفيذ
                        </Button>
                    )}

                    {isPrinting && (
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full border-green-200 text-green-700 hover:bg-green-50 font-bold h-10"
                                onClick={() => alert("جاري تحميل الملف...")}
                            >
                                <Download className="w-4 h-4 ml-2" />
                                تحميل الملف
                            </Button>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 transition-all"
                                onClick={() => onUpdateStatus(order.id, 'completed')}
                            >
                                <CheckSquare className="w-4 h-4 ml-2" />
                                جاهز للاستلام
                            </Button>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-slate-200 text-slate-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200 font-bold h-11 transition-colors"
                                onClick={openWhatsApp}
                                title="تواصل عبر واتساب"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </Button>
                            <Button
                                className="flex-[3] bg-green-600 hover:bg-green-700 text-white font-bold h-11 transition-all shadow-md shadow-green-200"
                                onClick={() => onUpdateStatus(order.id, order.delivery === 'home' ? 'out_for_delivery' : 'delivered')}
                            >
                                <CheckCircle className="w-4 h-4 ml-2" />
                                تسليم للعميل
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailsSheet 
                isOpen={isSheetOpen} 
                onClose={() => setIsSheetOpen(false)} 
                order={order} 
                onUpdateStatus={onUpdateStatus} 
            />

            <ReceiptDialog 
                isOpen={isReceiptOpen} 
                onClose={() => setIsReceiptOpen(false)} 
                order={order} 
            />
        </>
    );
}
