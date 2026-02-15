"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, User, FileText } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-10 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            {/* Item 1 (Right): My Orders */}
            <Link
                href="/dashboard"
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/dashboard') ? 'text-green-600' : 'text-gray-400'}`}
            >
                <FileText className={`w-6 h-6 ${isActive('/dashboard') ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-black">طلباتي</span>
            </Link>

            {/* Item 2 (Center): New Order - Floating Action Button */}
            <div className="relative -mt-14">
                <Link
                    href="/dashboard/new"
                    className="flex flex-col items-center justify-center w-16 h-16 bg-green-600 rounded-full text-white shadow-xl shadow-green-200 border-4 border-white transform transition-transform active:scale-90 hover:scale-105"
                >
                    <Plus className="w-9 h-9 font-black" />
                </Link>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-green-700 whitespace-nowrap">طلب جديد</span>
            </div>

            {/* Item 3 (Left): Profile */}
            <Link
                href="/dashboard/profile"
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/dashboard/profile') ? 'text-green-600' : 'text-gray-400'}`}
            >
                <User className={`w-6 h-6 ${isActive('/dashboard/profile') ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-black">حسابي</span>
            </Link>
        </nav>
    );
}
