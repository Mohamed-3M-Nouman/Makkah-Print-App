"use client";

import { usePathname } from "next/navigation";
import OperatorSidebar from "@/components/operator/OperatorSidebar";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/operator/login';

    // If it's the login page, render purely without sidebar or flex restrictions
    if (isLogin) {
        return <div dir="rtl" className="min-h-screen bg-slate-50">{children}</div>;
    }

    // Dashboard Layout
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans" dir="rtl">
            <OperatorSidebar />
            <main className="flex-1 overflow-y-auto w-full relative z-10 flex flex-col p-6">
                {children}
            </main>
        </div>
    );
}
