"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    Headphones,
    Settings,
    LogOut,
    User,
    Menu,
    X,
    MessageSquare,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSidebar({
    isSidebarOpen,
    setIsSidebarOpen
}: {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (isOpen: boolean) => void
}) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: "Live Queue", path: "/operator/dashboard", icon: LayoutDashboard },
        { name: "Order History", path: "/operator/history", icon: CheckSquare },
        { name: "Support", path: "/operator/support", icon: MessageSquare },
        { name: "Printers", path: "/operator/printers", icon: Printer },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col shadow-2xl header-admin`}>
            {/* Header */}
            <div className="h-20 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-950/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-green-500/20">MK</div>
                    <div>
                        <span className="font-bold text-lg block leading-none tracking-tight">Makaa Admin</span>
                        <span className="text-xs text-slate-400 font-medium">Print Operations</span>
                    </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</div>

                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} href={item.path}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 h-12 font-medium transition-all duration-200 
                                    ${active
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-500'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/30">
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800 h-11">
                    <Settings className="w-5 h-5" />
                    Settings
                </Button>

                <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-slate-800/50 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 bg-green-900/50 rounded-full flex items-center justify-center ring-2 ring-slate-800 group-hover:ring-green-500/30 transition-all">
                        <User className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Admin User</p>
                        <p className="text-xs text-slate-400 truncate">Staff Member</p>
                    </div>
                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                </div>
            </div>
        </aside>
    );
}
