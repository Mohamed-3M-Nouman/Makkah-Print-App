"use client";

import { useState } from "react";
import { Menu, Search, Calendar, Filter } from "lucide-react";
import OperatorSidebar from "@/components/operator/OperatorSidebar";
import HistoryOrderCard from "@/components/operator/HistoryOrderCard";
import { mockOrders, Order } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Simulate a larger history
const historyMockData: Order[] = [
    ...mockOrders,
    {
        id: 99,
        date: "2026-02-10",
        status: "delivered",
        serviceType: 'print',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: "Report_2025.docx",
                type: "document",
                pageCount: 15,
                color: "bw",
                sides: "single",
                binding: "staple",
                quantity: 3,
                itemPrice: 45.00
            }
        ],
        delivery: "home",
        customerName: "علي إبراهيم",
        customerPhone: "01512341234",
        customerEmail: "ali@test.com",
        totalPrice: 45.00,
        time: "10:30 ص"
    },
    {
        id: 98,
        date: "2026-02-09",
        status: "completed",
        serviceType: 'print',
        paymentMethod: 'cash',
        items: [
            {
                fileName: "Photos_Archive.zip",
                type: "image_batch",
                pageCount: 50,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 1,
                itemPrice: 150.00
            }
        ],
        delivery: "pickup",
        customerName: "هدى سالم",
        customerPhone: "01234567891",
        customerEmail: "huda@test.com",
        totalPrice: 150.00,
        time: "02:15 م"
    }
];

export default function CompletedOrdersPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");

    // Filter only completed/delivered orders
    const completedOrders = historyMockData.filter(o =>
        ['completed', 'delivered', 'out_for_delivery'].includes(o.status)
    );

    const filteredOrders = completedOrders.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchTerm) ||
            (order.customerName && order.customerName.includes(searchTerm)) ||
            (order.customerPhone && order.customerPhone.includes(searchTerm));

        // Simple date filtering logic (mock)
        const matchesDate = dateFilter === "all" ? true : true; // In a real app, parse `order.date`

        return matchesSearch && matchesDate;
    });

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
                                <h1 className="text-2xl font-black text-slate-900">سجل الطلبات المنتهية</h1>
                                <p className="text-sm text-slate-500 font-bold">أرشيف العمليات المكتملة</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="ابحث برقم الطلب، اسم العميل، أو الهاتف..."
                                className="pr-10 h-11 bg-white border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] h-11 bg-white border-slate-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4" />
                                        <SelectValue placeholder="التاريخ" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">كل التواريخ</SelectItem>
                                    <SelectItem value="today">اليوم</SelectItem>
                                    <SelectItem value="yesterday">أمس</SelectItem>
                                    <SelectItem value="week">آخر 7 أيام</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-white hover:border-slate-300">
                                <Filter className="w-4 h-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-100/50">
                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                            {filteredOrders.map((order) => (
                                <HistoryOrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                                <Search className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-xl font-bold">لا توجد نتائج مطابقة للبحث</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
