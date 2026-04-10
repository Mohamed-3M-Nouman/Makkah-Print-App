"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signout } from "@/app/auth/actions";

interface HeaderProps {
    showLogout?: boolean;
    userName?: string;
}

export default function Header({
    showLogout = false,
    userName = "محمد أحمد"
}: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await signout();
    };

    const handleEditProfile = () => {
        console.log("Edit Profile clicked");
        router.push("/home/profile");
    };

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(showLogout ? '/home' : '/')}>
                        <Image
                            src="/logo.png"
                            alt="مركز مكة للطباعة"
                            width={50}
                            height={50}
                            className="rounded-md"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-xl md:text-2xl font-bold text-green-600">
                                مركز مكة للطباعة
                            </h1>
                        </div>
                        {/* Mobile Brand */}
                        <h1 className="sm:hidden text-lg font-bold text-green-600">
                            مكة
                        </h1>
                    </div>

                    {/* Phone Number - Hidden on Mobile */}
                    <div className="hidden lg:flex items-center gap-4 text-green-700">
                        <div className="flex items-center gap-1 group">
                            <Phone className="w-4 h-4 text-green-600" />
                            <a
                                href="tel:01115503050"
                                className="font-semibold hover:text-green-500 transition-colors"
                                dir="ltr"
                            >
                                01115503050
                            </a>
                        </div>
                        <div className="w-px h-4 bg-green-200"></div>
                        <div className="flex items-center gap-1 group">
                            <Phone className="w-4 h-4 text-green-600" />
                            <a
                                href="tel:01029307444"
                                className="font-semibold hover:text-green-500 transition-colors"
                                dir="ltr"
                            >
                                01029307444
                            </a>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center gap-3">
                        {showLogout && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-green-600 text-green-700 hover:bg-green-50 flex items-center gap-2"
                                    >
                                        {/* User Icon */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{userName}</span>
                                        {/* Chevron Down */}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 text-right">
                                    <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer justify-end gap-2">
                                        <span>تعديل البيانات</span>
                                        {/* Settings Icon */}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 justify-end gap-2">
                                        <span>تسجيل الخروج</span>
                                        {/* Logout Icon */}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
