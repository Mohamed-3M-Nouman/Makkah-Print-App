"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ClipboardList,
    Plus,
    User
} from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    // Pages where the bottom nav should be hidden
    const hideNav = pathname.includes('/home/new') || pathname.includes('/checkout');

    if (hideNav) return null;

    const isActive = (href: string) => pathname === href || (href !== '/home' && pathname.startsWith(href));

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-end z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] h-20 pb-4">

            {/* Item 1 (Right): Home */}
            <Link
                href="/home"
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${isActive('/home') ? 'text-green-600' : 'text-slate-400'}`}
            >
                <Home className={`w-6 h-6 ${isActive('/home') ? 'fill-current' : ''}`} strokeWidth={isActive('/home') ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive('/home') ? 'text-green-700' : ''}`}>الرئيسية</span>
            </Link>

            {/* Item 2 (Right-Center): Orders */}
            <Link
                href="/orders"
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${isActive('/orders') ? 'text-green-600' : 'text-slate-400'}`}
            >
                <ClipboardList className={`w-6 h-6 ${isActive('/orders') ? 'fill-green-100' : ''}`} strokeWidth={isActive('/orders') ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive('/orders') ? 'text-green-700' : ''}`}>طلباتي</span>
            </Link>

            {/* Item 3 (Center): New Order FAB */}
            <div className="relative -top-5">
                <Link
                    href="/home/new"
                    className="flex items-center justify-center w-14 h-14 bg-green-600 rounded-full text-white shadow-lg shadow-green-200 border-[3px] border-white transform transition-transform active:scale-95 hover:scale-105 hover:shadow-green-300"
                >
                    <Plus className="w-8 h-8 font-black stroke-[3]" />
                </Link>
                {/* Optional Label for FAB */}
                {/* <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-green-700 whitespace-nowrap">جديد</span> */}
            </div>

            {/* Item 4 (Left): Profile */}
            <Link
                href="/home/profile"
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${isActive('/home/profile') ? 'text-green-600' : 'text-slate-400'}`}
            >
                <User className={`w-6 h-6 ${isActive('/home/profile') ? 'fill-current' : ''}`} strokeWidth={isActive('/home/profile') ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive('/home/profile') ? 'text-green-700' : ''}`}>حسابي</span>
            </Link>

        </nav>
    );
}
