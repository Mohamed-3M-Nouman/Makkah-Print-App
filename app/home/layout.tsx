"use client";

import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col pb-20 md:pb-0">
            {children}
            <BottomNav />
        </div>
    );
}
