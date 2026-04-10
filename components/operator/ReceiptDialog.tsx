"use client";

import { Order } from "@/lib/mockData";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, MessageCircle } from "lucide-react";
import { PRICING_CONFIG } from "@/lib/pricing-config";

interface ReceiptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

export default function ReceiptDialog({ isOpen, onClose, order }: ReceiptDialogProps) {
    // Generate simple time if missing
    const date = order.date;
    const time = order.time || new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm p-0 bg-white rounded-none sm:rounded-lg overflow-hidden border-slate-300 shadow-2xl" dir="rtl" aria-describedby="receipt-desc">
                
                {/* Header accessible title */}
                <div id="receipt-desc" className="sr-only">فاتورة الطلب رقم {order.id}</div>

                <div id="printable-receipt" className="w-full bg-white text-slate-900 p-6 flex flex-col font-mono text-sm leading-relaxed mx-auto">
                    {/* Brand Header */}
                    <div className="text-center mb-4 space-y-1">
                        <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">مركز مكة للطباعة</DialogTitle>
                        <p className="text-lg font-bold">رقم الطلب: #{order.id}</p>
                        <p className="text-[11px] text-slate-500 font-bold">التاريخ: {date} | {time}</p>
                    </div>

                    <div className="border-b-2 border-dashed border-slate-300 my-3"></div>

                    {/* Customer Info */}
                    <div className="text-[12px] text-center space-y-1 mb-3 font-bold">
                        <p>العميل: {order.customerName || "عميل غير مسجل"} {order.customerPhone ? `- ${order.customerPhone}` : ''}</p>
                    </div>

                    <div className="border-b-2 border-dashed border-slate-300 my-3"></div>

                    {/* Items List */}
                    <div className="space-y-4 mb-3 flex-1 min-h-[100px]">
                        {order.items.map((item, idx) => {
                            const typeName = item.type === "document" ? "مستند (ملف PDF)" : "مجموعة صور";
                            const colorText = item.color === 'color' ? `ألوان (${item.inkType === 'laser' ? 'ليزر' : 'مائي'})` : 'أبيض وأسود';
                            const sidesText = item.sides === 'double' ? 'وجهين' : 'وجه واحد';
                            const desc = `(${colorText} | ${sidesText} | ${item.quantity} نسخ)`;
                            const price = item.itemPrice ? `${item.itemPrice} ج` : '';
                            return (
                                <div key={idx} className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[12px] truncate whitespace-normal leading-tight">{typeName}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                                    </div>
                                    <div className="shrink-0 text-left font-bold text-[12px]">{price}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-b-2 border-dashed border-slate-300 my-3"></div>

                    {/* Totals */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-[12px]">
                            <span>المجموع الفرعي:</span>
                            <span className="font-bold">{order.totalPrice} ج.م</span>
                        </div>
                        {order.delivery === 'home' && (
                            <div className="flex justify-between items-center text-[12px]">
                                <span>خدمة التوصيل:</span>
                                <span className="font-bold border-b border-dashed border-slate-300 pb-1">{PRICING_CONFIG.delivery} ج.م</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-[12px] pt-1">
                            <span>وسيلة الدفع:</span>
                            <span className="font-bold">{order.paymentMethod === 'wallet' ? 'فودافون كاش' : 'دفع نقدي (كاش)'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-black">الإجمالي:</span>
                            <span className="text-xl font-black">{order.delivery === 'home' ? order.totalPrice + PRICING_CONFIG.delivery : order.totalPrice} ج.م</span>
                        </div>
                    </div>

                    <div className="border-b-2 border-dashed border-slate-300 my-3"></div>

                    {/* Footer */}
                    <div className="text-center mt-2 space-y-2 text-[10px]">
                        <p className="font-bold">شكراً لزيارتكم!</p>
                        <div className="flex items-center justify-center gap-1 opacity-70">
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-sans" dir="ltr">+20 123 456 7890</span>
                        </div>
                    </div>
                </div>

                {/* Print Action / Dialog Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 no-print">
                    <Button 
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11"
                        onClick={() => window.print()}
                    >
                        <Printer className="w-4 h-4 ml-2" />
                        طباعة الفاتورة
                    </Button>
                    <Button variant="outline" className="h-11 w-20 font-bold border-slate-200" onClick={onClose}>
                        إغلاق
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
