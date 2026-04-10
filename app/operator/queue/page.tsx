"use client";

import { useState } from "react";
import { Menu, Search, Filter } from "lucide-react";
import OperatorSidebar from "@/components/operator/OperatorSidebar";
import QueueOrderCard from "@/components/operator/QueueOrderCard";
import { mockOrders, Order, OrderStatus } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const extendedMockOrders: Order[] = [
    ...mockOrders,
    {
        id: 105,
        date: "2026-02-16",
        status: "pending_review",
        serviceType: 'print',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: "Project_Final.pdf",
                type: "document",
                pageCount: 30,
                color: "color",
                sides: "double",
                binding: "spiral",
                quantity: 5,
                itemPrice: 150.00
            }
        ],
        delivery: "pickup",
        customerName: "يوسف أحمد",
        customerPhone: "01012345678",
        customerEmail: "youssef@example.com",
        totalPrice: 150.00,
        notes: "طباعة فاخرة"
    },
    // Add more for "Printing" state demo
    {
        id: 106,
        date: "2026-02-16",
        status: "printing",
        serviceType: 'print',
        paymentMethod: 'cash',
        items: [
            {
                fileName: "Flyer_Design.jpg",
                type: "image_batch",
                pageCount: 1,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 100,
                itemPrice: 2.00
            }
        ],
        delivery: "home",
        customerName: "شركة النور",
        customerPhone: "01198765432",
        customerEmail: "contact@alnoor.com",
        totalPrice: 200.00
    }
];

export default function OrderQueuePage() {
    const [orders, setOrders] = useState<Order[]>(extendedMockOrders.sort((a, b) => b.id - a.id));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'printing' | 'ready'>('all');

    const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return ['pending_review', 'confirmed', 'printing', 'completed'].includes(order.status);
        if (activeTab === 'new') return ['pending_review', 'confirmed'].includes(order.status);
        if (activeTab === 'printing') return order.status === 'printing';
        if (activeTab === 'ready') return order.status === 'completed';
        return true;
    });

    const counts = {
        new: orders.filter(o => ['pending_review', 'confirmed'].includes(o.status)).length,
        printing: orders.filter(o => o.status === 'printing').length,
        ready: orders.filter(o => o.status === 'completed').length
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
            <OperatorSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 z-30 shadow-sm shrink-0">
                    <div className="px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900">طابور الطلبات الحية</h1>
                                <p className="text-sm text-slate-500 font-bold">إدارة تدفق العمل لحظة بلحظة</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block w-64">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="بحث برقم الطلب..." className="pr-9 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-6 flex gap-2 overflow-x-auto pb-0 custom-scrollbar border-t border-slate-100 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'all' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'new' ? 'border-yellow-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <span>🆕 طلبات جديدة</span>
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 shadow-none text-xs px-1.5 h-5">{counts.new}</Badge>
                        </button>
                        <button
                            onClick={() => setActiveTab('printing')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'printing' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <span>🌀 جاري الطباعة</span>
                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-none text-xs px-1.5 h-5">{counts.printing}</Badge>
                        </button>
                        <button
                            onClick={() => setActiveTab('ready')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'ready' ? 'border-green-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <span>✅ جاهز للاستلام</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 shadow-none text-xs px-1.5 h-5">{counts.ready}</Badge>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-100/50">
                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {filteredOrders.map((order) => (
                                <QueueOrderCard
                                    key={order.id}
                                    order={order}
                                    onUpdateStatus={updateOrderStatus}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                                <Filter className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-xl font-bold">لا توجد طلبات في هذه القائمة حالياً</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
