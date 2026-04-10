"use client";

import { useState } from "react";
import {
    Menu,
} from "lucide-react";
import OperatorSidebar from "@/components/operator/OperatorSidebar";
import OrderCardLocalized from "@/components/operator/OrderCardLocalized";
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
                binding: "spiral",
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
                binding: "none",
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

    const toggleShopStatus = () => {
        setShopStatus(prev => prev === 'online' ? 'offline' : 'online');
    };

    const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex" dir="rtl">
            {/* Sidebar (Modular Component) */}
            <OperatorSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50">
                    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">لوحة تحكم المُشغل - مركز مكة</h1>
                                <p className="text-sm text-slate-500 font-medium hidden sm:block">إدارة ومتابعة طلبات الطباعة الواردة</p>
                            </div>
                        </div>

                        <div
                            className={`flex items-center gap-3 px-5 py-2.5 rounded-full cursor-pointer transition-all border shadow-sm hover:shadow-md ${shopStatus === 'online' ? 'bg-green-50/50 border-green-200 hover:bg-green-50' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                            onClick={toggleShopStatus}
                        >
                            <span className="relative flex h-3 w-3">
                                {shopStatus === 'online' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${shopStatus === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                            </span>
                            <span className={`font-bold text-sm ${shopStatus === 'online' ? 'text-green-700' : 'text-slate-500'}`}>
                                {shopStatus === 'online' ? 'المتجر متاح لاستقبال الطلبات' : 'المتجر مغلق مؤقتاً'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50/50">
                    {/* Stats / Quick Filters could go here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold text-sm">طلبات جديدة</p>
                                <p className="text-3xl font-black text-orange-600 mt-1">
                                    {orders.filter(o => ['pending_review', 'confirmed'].includes(o.status)).length}
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
                                    {orders.filter(o => o.status === 'printing').length}
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
                                    {orders.filter(o => ['completed', 'out_for_delivery'].includes(o.status)).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {orders.map((order) => (
                            <div key={order.id} className="h-full">
                                <OrderCardLocalized
                                    order={order}
                                    updateStatus={updateOrderStatus} // Pass the function correctly
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
