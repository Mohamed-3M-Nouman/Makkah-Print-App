"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OperatorOrderCard from "@/components/operator/OperatorOrderCard";
import { mockOrders, Order, OrderStatus } from "@/lib/mockData";

// Extended mock data for demo purposes
const extendedMockOrders: Order[] = [
    ...mockOrders,
    {
        id: 101,
        date: "2026-02-15",
        status: "printing",
        serviceType: 'print',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: "Engineering_Project_Proposal.pdf",
                type: "document",
                pageCount: 45,
                color: "color",
                sides: "single",
                pagesPerSheet: 1,
                printRange: "الكل",
                quantity: 1,
                itemPrice: 150.00
            }
        ],
        delivery: "pickup",
        customerName: "محمود حسن",
        customerPhone: "01098765432",
        customerEmail: "mahmoud@example.com",
        totalPrice: 150.00,
        notes: "يرجى تحسين سطوع الألوان في الرسوم البيانية"
    },
    {
        id: 102,
        date: "2026-02-15",
        status: "pending_review",
        serviceType: 'print',
        paymentMethod: 'cash',
        items: [
            {
                fileName: ["Scan_001.jpg", "Scan_002.jpg"],
                type: "image_batch",
                pageCount: 2,
                color: "bw",
                sides: "single",
                pagesPerSheet: 1,
                printRange: "الكل",
                quantity: 10,
                itemPrice: 20.00
            }
        ],
        delivery: "home",
        customerName: "ليلى أحمد",
        customerPhone: "01122334455",
        customerEmail: "layla@example.com",
        totalPrice: 20.00
    }
];

export default function OperatorDashboard() {
    const [shopStatus, setShopStatus] = useState<'online' | 'offline'>('online');
    const [orders, setOrders] = useState<Order[]>(extendedMockOrders.sort((a, b) => b.id - a.id));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleShopStatus = () => {
        setShopStatus(prev => prev === 'online' ? 'offline' : 'online');
    };

    const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // Filter logic
    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            o.id.toString().includes(searchQuery) ||
            (o.customerName && o.customerName.includes(searchQuery)) ||
            (o.customerPhone && o.customerPhone.includes(searchQuery));
        
        return matchesSearch;
    });

    const pendingOrders = filteredOrders.filter(o => ['pending_review', 'confirmed'].includes(o.status));
    const printingOrders = filteredOrders.filter(o => o.status === 'printing');
    const readyOrders = filteredOrders.filter(o => ['completed', 'out_for_delivery'].includes(o.status));

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">لوحة تحكم المُشغل</h1>
                        </div>
                    </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Search className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="bg-slate-100 border-none text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-green-500 block w-full pr-10 p-2.5 h-11"
                                    placeholder="بحث برقم الطلب أو اسم العميل..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div
                            className={`flex whitespace-nowrap items-center gap-3 px-5 py-2.5 rounded-full cursor-pointer transition-all border shadow-sm hover:shadow-md ${shopStatus === 'online' ? 'bg-green-50/50 border-green-200 hover:bg-green-50' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                            onClick={toggleShopStatus}
                        >
                            <span className="relative flex h-3 w-3">
                                {shopStatus === 'online' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${shopStatus === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                            </span>
                            <span className={`font-bold text-sm hidden sm:block ${shopStatus === 'online' ? 'text-green-700' : 'text-slate-500'}`}>
                                {shopStatus === 'online' ? 'المتجر متاح لاستقبال الطلبات' : 'المتجر مغلق مؤقتاً'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Area - Kanban Board */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-100/50">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold text-sm">طلبات جديدة</p>
                                <p className="text-3xl font-black text-orange-600 mt-1">
                                    {pendingOrders.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                <div className="animate-pulse w-3 h-3 bg-orange-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold text-sm">جاري تنفيذها</p>
                                <p className="text-3xl font-black text-indigo-600 mt-1">
                                    {printingOrders.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold text-sm">جاهزة للاستلام</p>
                                <p className="text-3xl font-black text-green-600 mt-1">
                                    {readyOrders.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start min-h-[calc(100vh-16rem)]">
                        
                        {/* Column 1: New / Pending */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <h2 className="font-black text-slate-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                                    طلبات جديدة
                                </h2>
                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">
                                    {pendingOrders.length}
                                </span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                                {pendingOrders.length === 0 ? (
                                    <div className="text-center p-8 text-slate-400 font-medium text-sm">لا توجد طلبات جديدة</div>
                                ) : (
                                    pendingOrders.map(order => (
                                        <OperatorOrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Column 2: Printing */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <h2 className="font-black text-slate-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
                                    جاري الطباعة
                                </h2>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg">
                                    {printingOrders.length}
                                </span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                                {printingOrders.length === 0 ? (
                                    <div className="text-center p-8 text-slate-400 font-medium text-sm">لا توجد طلبات جاري تنفيذها</div>
                                ) : (
                                    printingOrders.map(order => (
                                        <OperatorOrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Column 3: Ready */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <h2 className="font-black text-slate-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                                    جاهزة للاستلام
                                </h2>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                                    {readyOrders.length}
                                </span>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                                {readyOrders.length === 0 ? (
                                    <div className="text-center p-8 text-slate-400 font-medium text-sm">لا توجد طلبات جاهزة</div>
                                ) : (
                                    readyOrders.map(order => (
                                        <OperatorOrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
        </>
    );
}
