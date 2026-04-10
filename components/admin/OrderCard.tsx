"use client";

import { Download, FileText, Phone, User, Printer, CheckSquare, CheckCircle, AlertCircle, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/lib/mockData";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending_review: { label: "New", color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
    printing: { label: "Processing", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Printer },
    completed: { label: "Ready", color: "bg-green-100 text-green-700 border-green-200", icon: CheckSquare },
};

interface OrderCardProps {
    order: Order;
    updateStatus: (id: number, status: OrderStatus) => void;
}

export default function OrderCard({ order, updateStatus }: OrderCardProps) {
    const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;
    const isProcessing = order.status === 'printing';
    const isNew = order.status === 'pending_review' || order.status === 'confirmed';
    const isCompleted = ['completed', 'out_for_delivery', 'delivered'].includes(order.status);

    return (
        <Card className="border-none shadow-sm hover:shadow-lg transition-all bg-white flex flex-col h-full rounded-2xl overflow-hidden ring-1 ring-slate-200 hover:ring-green-400 group">
            {/* Status Badge */}
            <div className="p-1.5 absolute top-4 right-4 z-10">
                <Badge className={`${statusConfig[order.status]?.color} shadow-sm border px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[order.status]?.label || order.status}
                </Badge>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col gap-5">
                {/* Header Info */}
                <div className="space-y-1 pr-16">
                    <div className="flex items-center gap-2">
                        <p className="font-black text-2xl text-slate-800">#{order.id}</p>
                        {order.delivery === 'pickup' ? (
                            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-500">Pick-up</Badge>
                        ) : (
                            <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-600">Deliv.</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {order.time || "Just now"}
                    </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{order.customerName || "Customer Name"}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{order.customerPhone || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* Files & Specs */}
                <div className="space-y-3 flex-1">
                    <div className="space-y-2">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="group/file relative bg-white border border-slate-200 rounded-xl p-3 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover/file:bg-green-100 transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-700 truncate" title={Array.isArray(item.fileName) ? item.fileName.join(', ') : item.fileName}>
                                            {Array.isArray(item.fileName) ? `${item.fileName.length} Files` : item.fileName}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.pageCount} pages • {item.color === 'bw' ? 'B&W' : 'Color'}</p>
                                    </div>
                                </div>

                                {/* Specs Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    <Badge className="bg-slate-100 text-slate-700 text-[10px] border-none font-bold px-1.5 shadow-none group-hover/file:bg-slate-200">
                                        {item.quantity} Copies
                                    </Badge>
                                    <Badge className="bg-slate-100 text-slate-700 text-[10px] border-none font-bold px-1.5 shadow-none group-hover/file:bg-slate-200">
                                        {item.sides === 'single' ? '1-Sided' : '2-Sided'}
                                    </Badge>
                                    <Badge className="bg-slate-100 text-slate-700 text-[10px] border-none font-bold px-1.5 shadow-none group-hover/file:bg-slate-200">
                                        {item.binding}
                                    </Badge>
                                </div>

                                <Button size="sm" variant="outline" className="w-full text-xs h-8 border-green-200 text-green-700 hover:bg-green-50 font-bold gap-2 focus:ring-2 ring-green-500/20">
                                    <Download className="w-3.5 h-3.5" />
                                    Download PDF
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                    {!isCompleted && (
                        <>
                            {isNew && (
                                <Button
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    onClick={() => updateStatus(order.id, 'printing')}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Start Printing
                                </Button>
                            )}

                            {isProcessing && (
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:translate-y-0 animate-in fade-in zoom-in duration-300 ring-2 ring-green-100"
                                    onClick={() => updateStatus(order.id, 'completed')}
                                >
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    Ready for Pickup
                                </Button>
                            )}
                        </>
                    )}

                    {isCompleted && (
                        <div className="text-center py-2 bg-green-50/50 rounded-xl border border-green-100/50">
                            <p className="text-sm font-bold text-green-700 flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4 animate-in fade-in zoom-in" />
                                Completed
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
