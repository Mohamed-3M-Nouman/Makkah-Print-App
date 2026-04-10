"use client";

import { Download, FileText, Phone, MessageCircle, AlertTriangle, Wallet, DollarSign, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/lib/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface OrderDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    onUpdateStatus: (id: number, status: OrderStatus) => void;
}

export default function OrderDetailsSheet({ isOpen, onClose, order, onUpdateStatus }: OrderDetailsSheetProps) {
    const openWhatsApp = () => {
        const message = `مرحباً ${order.customerName || 'عميلنا العزيز'}، بخصوص طلبك رقم #${order.id} من مركز مكة للطباعة...`;
        const url = `https://wa.me/20${order.customerPhone?.replace(/^0/, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white border-r-0 shadow-2xl" dir="rtl" showCloseButton={false}>
                
                {/* Header */}
                <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-start justify-between space-y-0 text-right">
                    <div>
                        <SheetTitle className="text-2xl font-black text-slate-800">طلب #{order.id}</SheetTitle>
                        <Badge variant="outline" className="mt-1 font-bold">
                            {order.status === 'pending_review' || order.status === 'confirmed' ? 'جديد' : order.status === 'printing' ? 'جاري الطباعة' : 'مكتمل / جاهز'}
                        </Badge>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors self-start mt-1">
                        <X className="w-6 h-6" />
                    </button>
                </SheetHeader>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Customer */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">بيانات العميل</h3>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-800">{order.customerName || "غير محدد"}</p>
                                <div className="flex items-center gap-1.5 mt-1 text-slate-500 font-mono text-sm" dir="ltr">
                                    <Phone className="w-3.5 h-3.5" />
                                    {order.customerPhone || "N/A"}
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-500">
                                    التسليم: {order.delivery === 'home' ? 'توصيل للمنزل' : 'استلام من الفرع'}
                                </div>
                            </div>
                            <Button size="icon" onClick={openWhatsApp} className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full h-10 w-10 shrink-0">
                                <MessageCircle className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Files & Specs */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">الملفات والمواصفات</h3>
                        
                        {order.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-yellow-800 uppercase mb-1">ملاحظات العميل</p>
                                    <p className="text-sm font-medium text-yellow-900">{order.notes}</p>
                                </div>
                            </div>
                        )}

                        {order.items.map((item, idx) => (
                            <div key={idx} className="bg-slate-100 p-4 rounded-lg space-y-4 mb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="p-2.5 bg-white text-slate-600 rounded-lg shadow-sm shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 truncate leading-tight" title={Array.isArray(item.fileName) ? item.fileName.join(', ') : item.fileName}>
                                                {Array.isArray(item.fileName) ? `${item.fileName.length} ملفات` : item.fileName}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">{item.pageCount} صفحة</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold h-9 shadow-sm shrink-0">
                                        <Download className="w-4 h-4 ml-1.5" />
                                        تحميل
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-500">اللون:</span>
                                        <span className="font-bold text-slate-800">
                                            {item.color === 'color' ? `ألوان (${item.inkType === 'laser' ? 'ليزر' : 'مائي'})` : 'أبيض وأسود'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-500">الأوجه:</span>
                                        <span className="font-bold text-slate-800">
                                            {item.sides === 'single' ? 'وجه واحد' : 'وجهين'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2 sm:border-b-0">
                                        <span className="text-slate-500">عدد الصفحات في الوجه:</span>
                                        <span className="font-bold text-slate-800">{item.pagesPerSheet} صفحة</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2 sm:border-b-0">
                                        <span className="text-slate-500">نطاق الطباعة:</span>
                                        <span className="font-bold text-slate-800">{item.printRange || 'الكل'}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 sm:col-span-2 mt-1 border-t border-slate-50">
                                        <span className="text-slate-500">الكمية:</span>
                                        <span className="font-black text-slate-900">{item.quantity} نسخ</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Financial */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">السداد المالية</h3>
                        <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2">
                                {order.paymentMethod === 'wallet' ? <Wallet className="w-5 h-5 text-green-400" /> : <DollarSign className="w-5 h-5 text-green-400" />}
                                <span className="font-bold">{order.paymentMethod === 'wallet' ? "محفظة إلكترونية" : "دفع نقدي (كاش)"}</span>
                            </div>
                            <span className="font-black text-xl font-mono">{order.totalPrice} ج.م</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-3">
                        {['completed', 'out_for_delivery', 'delivered'].includes(order.status) ? (
                            <div className="flex-1 w-full h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none font-bold px-3 py-1 text-sm">
                                    ✓ مكتمل (أرشيف)
                                </Badge>
                            </div>
                        ) : (
                            <div className="flex-1 w-full relative">
                                <select 
                                    className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-4 appearance-none focus:ring-2 outline-none focus:border-green-500 transition-colors"
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                >
                                    <option value="pending_review">جديد / قيد المراجعة</option>
                                    <option value="printing">جاري التنفيذ (الطباعة)</option>
                                    <option value="completed">جاهز للاستلام</option>
                                    <option value="out_for_delivery">جاري التوصيل</option>
                                    <option value="delivered">تم التسليم</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">▼</div>
                            </div>
                        )}
                        <Button variant="outline" className="h-12 w-24 font-bold border-slate-200 text-slate-600 hover:bg-slate-100" onClick={onClose}>
                            إغلاق
                        </Button>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    );
}
