"use client";

import { useState } from "react";
import OperatorSidebar from "@/components/operator/OperatorSidebar";

export default function OperatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 overflow-hidden font-sans min-h-screen max-w-[100vw]" dir="rtl">
            <OperatorSidebar />
            <main className="flex-1 overflow-y-auto w-full min-w-0 transition-all duration-300 relative z-10 flex flex-col">
                {children}
            </main>
        </div>
    );
}
