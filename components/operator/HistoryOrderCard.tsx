"use client";

import { CheckCircle, Clock, FileText, Printer, Receipt, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/mockData";

interface HistoryOrderCardProps {
    order: Order;
    onDetailsClick?: () => void;
    onReceiptClick?: () => void;
}

export default function HistoryOrderCard({ order, onDetailsClick, onReceiptClick }: HistoryOrderCardProps) {
    // Helper to summarize specs
    const getSpecsSummary = () => {
        const firstItem = order.items[0];
        if (!firstItem) return "لا يوجد عناصر";

        const colorText = firstItem.color === 'color' ? `ألوان (${firstItem.inkType === 'laser' ? 'ليزر' : 'مائي'})` : 'أبيض وأسود';
        const sidesText = firstItem.sides === 'double' ? 'وجهين' : 'وجه واحد';
        const pagesSuffix = firstItem.pagesPerSheet ? ` (${firstItem.pagesPerSheet} صفحة)` : '';
        const rangeText = `نطاق: ${firstItem.printRange || 'الكل'}`;
        const qtyText = `${firstItem.quantity} نسخ`;

        let summary = `${colorText} | ${sidesText}${pagesSuffix} | ${rangeText} | ${qtyText}`;
        if (order.items.length > 1) {
            summary += ` (+${order.items.length - 1})`;
        }
        return summary;
    };

    return (
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group rounded-xl" dir="rtl">
            <CardContent className="p-5 flex flex-col gap-4">
                {/* Header: Status & ID */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200 px-2 py-1 flex items-center gap-1 hover:bg-slate-200 shadow-none">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-bold">تم الانتهاء</span>
                        </Badge>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.time || "4:30 م"}
                        </span>
                    </div>
                    <span className="font-black text-lg text-slate-800 font-mono">#{order.id}</span>
                </div>

                {/* Main Info */}
                <div className="flex items-center gap-3 py-1">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate text-sm">{order.customerName || "عميل غير مسجل"}</p>
                        <p className="text-xs text-slate-500 font-mono dir-ltr text-right">{order.customerPhone || "N/A"}</p>
                    </div>
                    <div className="text-left shrink-0">
                        <p className="font-black text-green-700 text-lg dir-ltr">{order.totalPrice} ج.م</p>
                    </div>
                </div>

                {/* Specs Summary */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center gap-3">
                    <Printer className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-[11px] font-bold text-slate-600 truncate flex-1 leading-relaxed">
                        {getSpecsSummary()}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold h-9 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900" onClick={onDetailsClick}>
                        <FileText className="w-3.5 h-3.5 ml-1.5" />
                        التفاصيل
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" title="إعادة طباعة">
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-slate-400 hover:text-green-700 hover:bg-green-50 rounded-lg" 
                            title="فاتورة"
                            onClick={onReceiptClick}
                        >
                            <Receipt className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
