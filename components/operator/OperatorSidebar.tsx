"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    Headphones,
    Settings,
    LogOut,
    User,
    X,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function OperatorSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: "لوحة التحكم", path: "/operator/dashboard", icon: LayoutDashboard },
        { name: "الطلبات المنتهية", path: "/operator/history", icon: CheckSquare },
        { name: "الدعم الفني", path: "/operator/support", icon: Headphones },
    ];

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // Sidebar width classes depending on collapsed state
    const widthClass = isCollapsed ? "w-20" : "w-60";

    const handleLogout = () => {
        document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/operator/login");
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            {!isSidebarOpen && (
                <button
                    className="lg:hidden fixed top-6 right-6 z-40 p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-xl"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            <aside className={`fixed inset-y-0 right-0 z-50 ${widthClass} shrink-0 h-screen bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 lg:static`} dir="rtl">
            {/* Header */}
            <div className="h-20 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-950/50">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <div className="w-10 h-10 min-w-[40px] bg-green-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-green-500/20">م</div>
                    
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <span className="font-bold text-lg block leading-none tracking-tight text-right">مركز مكة</span>
                            <span className="text-xs text-slate-400 font-medium">لوحة المشغل</span>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors shrink-0">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                )}

                <button 
                    onClick={toggleCollapse} 
                    className={`hidden lg:flex p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 shadow-sm shrink-0
                        ${isCollapsed ? 'absolute -left-3.5 top-6 bg-slate-800 border border-slate-700 z-50 p-1' : ''}
                    `}
                    title={isCollapsed ? "توسيع" : "تصغير"}
                >
                    {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                {!isCollapsed && (
                    <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right overflow-hidden whitespace-nowrap">القائمة الرئيسية</div>
                )}

                {navItems.map((item) => {
                    const active = isActive(item.path) || (item.path === "/operator/dashboard" && pathname === "/operator/dashboard");
                    return (
                        <Link key={item.path} href={item.path}>
                            <Button
                                variant="ghost"
                                title={isCollapsed ? item.name : undefined}
                                className={`w-full justify-start h-12 font-bold text-base transition-all duration-200 ${isCollapsed ? 'px-0 justify-center' : 'px-3 gap-3'} 
                                    ${active
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-500'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'ml-2'} ${active ? 'text-white' : 'text-slate-500'} shrink-0`} />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Settings (Dropdown Menu) */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/30">
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <div 
                            className={`flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-800/50 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer group 
                                ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? "ملف الموظف والإعدادات" : undefined}
                        >
                            <div className="w-9 h-9 min-w-[36px] bg-green-900/50 rounded-full flex items-center justify-center ring-2 ring-slate-800 group-hover:ring-green-500/30 transition-all shrink-0">
                                <User className="w-5 h-5 text-green-500" />
                            </div>
                            
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 min-w-0 text-right overflow-hidden whitespace-nowrap">
                                        <p className="text-sm font-bold text-white truncate">موظف التشغيل</p>
                                        <p className="text-xs text-slate-400 truncate">نشط الآن</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors transform rotate-180 shrink-0" />
                                </>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent className="w-56 font-sans font-bold" align={isCollapsed ? "center" : "end"} side="right" sideOffset={18}>
                        <DropdownMenuItem className="gap-2 cursor-pointer transition-colors focus:bg-slate-100 h-10" onClick={() => router.push('/operator/settings')}>
                            <Settings className="w-4 h-4 text-slate-500" />
                            الإعدادات
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700 cursor-pointer transition-colors focus:bg-red-50 h-10" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
        </>
    );
}
