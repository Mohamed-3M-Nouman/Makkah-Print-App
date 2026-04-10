"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, FileText, Image as ImageIcon, AlertTriangle, UploadCloud, Plus, Minus, Calculator, FileDigit, Loader2, Info, ReceiptText, Lock } from "lucide-react";
import { useDropzone } from "react-dropzone";
// pdfjs-dist import moved inside function to prevent SSR "DOMMatrix is not defined" errors
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { Textarea } from "@/components/ui/textarea";

// PDF.js Worker initialization moved inside getPdfPageCount to be browser-only

type ItemType = "document" | "image_batch";

interface OrderSettings {
    color: "bw" | "color";
    inkType?: string; // "inkjet" | "laser"
    sides: "single" | "double";
    pagesPerSheet: number;
    quantity: number;
    pageCount: number;
    rangeType: "all" | "custom";
    rangeFrom: number;
    rangeTo: number;
    notes?: string;
}

interface OrderItem {
    id: string;
    type: ItemType;
    files: File[];
    settings: OrderSettings;
    isProcessing?: boolean;
}

export default function NewOrderPage() {
    const router = useRouter();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [delivery, setDelivery] = useState<"pickup" | "home">("pickup");
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getPdfPageCount = async (file: File): Promise<number> => {
        if (typeof window === "undefined") return 1;

        try {
            // Dynamically import PDF.js only in the browser
            const pdfjsLib = await import("pdfjs-dist");

            // Set worker source dynamically
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            return pdf.numPages;
        } catch (error) {
            console.error("Error reading PDF page count:", error);
            return 1; // Fallback
        }
    };

    const processFiles = async (files: File[]) => {
        setIsGlobalLoading(true);
        const newItems: OrderItem[] = [];
        const imageFiles: File[] = [];

        for (const file of files) {
            const ext = file.name.split(".").pop()?.toLowerCase();
            const isPdf = ext === "pdf";
            const isDoc = ["doc", "docx"].includes(ext || "");
            const isImg = ["jpg", "jpeg", "png"].includes(ext || "");

            if (isPdf || isDoc) {
                let pages = 1;
                if (isPdf) {
                    pages = await getPdfPageCount(file);
                }

                newItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: "document",
                    files: [file],
                    settings: {
                        color: "bw",
                        sides: "single",
                        pagesPerSheet: 1,
                        quantity: 1,
                        pageCount: pages,
                        rangeType: "all",
                        rangeFrom: 1,
                        rangeTo: pages
                    },
                });
            } else if (isImg) {
                imageFiles.push(file);
            }
        }

        if (imageFiles.length > 0) {
            newItems.push({
                id: Math.random().toString(36).substr(2, 9),
                type: "image_batch",
                files: imageFiles,
                settings: {
                    color: "color",
                    inkType: "inkjet", // Defaulting to Inkjet as per requirements
                    sides: "single",
                    pagesPerSheet: 1,
                    quantity: 1,
                    pageCount: imageFiles.length,
                    rangeType: "all",
                    rangeFrom: 1,
                    rangeTo: imageFiles.length
                },
            });
        }

        setOrderItems((prev) => [...prev, ...newItems]);
        setIsGlobalLoading(false);
    };

    // React Dropzone Setup
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFiles(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        }
    });

    const removeItem = (id: string) => {
        setOrderItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateItemSettings = (id: string, newSettings: Partial<OrderSettings>) => {
        setOrderItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const settings = { ...item.settings, ...newSettings };

                    // Logic update: Ensure Ink Type defaults to "inkjet" when switching to "color"
                    if (newSettings.color === "color") {
                        settings.inkType = settings.inkType || "inkjet";
                    } else if (newSettings.color === "bw") {
                        delete settings.inkType;
                    }

                    return { ...item, settings };
                }
                return item;
            })
        );
    };

    const calculateItemPriceDetails = (item: OrderItem) => {
        const { pageCount, sides, color, inkType, quantity, pagesPerSheet, rangeType, rangeFrom, rangeTo } = item.settings;

        // 0. Calculate effective pages based on range
        const effectivePages = rangeType === "all"
            ? pageCount
            : Math.max(1, (rangeTo || pageCount) - (rangeFrom || 1) + 1);

        // 1. Determine sheet count
        // sheets = ceil(effectivePages / (pagesPerSheet * (sides === "double" ? 2 : 1)))
        const divisor = (pagesPerSheet || 1) * (sides === "double" ? 2 : 1);
        const sheets = Math.ceil(effectivePages / divisor);

        // 2. Determine base rate
        let rate = 0;
        if (color === "bw") {
            rate = PRICING_CONFIG.bw[sides as keyof typeof PRICING_CONFIG.bw];
        } else {
            const typeKey = `color_${inkType || 'inkjet'}` as "color_inkjet" | "color_laser";
            rate = PRICING_CONFIG[typeKey][sides as keyof typeof PRICING_CONFIG.color_inkjet];
        }

        const subtotal = sheets * rate * quantity;
        const total = subtotal;

        return { sheets, rate, total, subtotal, effectivePages };
    };

    const totalPrice = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + calculateItemPriceDetails(item).total, 0);
    }, [orderItems]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderItems.length === 0) {
            alert("يرجى إضافة ملف واحد على الأقل");
            return;
        }

        setIsSubmitting(true);

        const serializableItems = orderItems.map(item => ({
            id: item.id,
            fileNames: item.files.map(f => f.name),
            type: item.type,
            settings: item.settings,
            priceDetails: calculateItemPriceDetails(item)
        }));

        const orderData = {
            orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            items: serializableItems,
            delivery,
            deliveryFee: delivery === "home" ? PRICING_CONFIG.delivery : 0,
            subtotal: totalPrice,
            grandTotal: totalPrice + (delivery === "home" ? PRICING_CONFIG.delivery : 0)
        };

        // Simulate a brief delay for better UX
        setTimeout(() => {
            localStorage.setItem('currentOrder', JSON.stringify(orderData));
            router.push("/home/checkout");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-background to-yellow-50">
            <Header showLogout={true} />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8 text-right" dir="rtl">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-green-700">طلب طباعة جديد</h1>
                    <p className="text-muted-foreground font-medium">ابدأ برفع ملفاتك وخصص إعدادات كل ملف بكل سهولة</p>
                </div>

                {/* Upload Zone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-[2rem] transition-all cursor-pointer relative overflow-hidden group
                        ${isDragActive
                            ? "border-green-600 bg-green-50 shadow-inner scale-[1.01]"
                            : "border-gray-200 hover:border-green-400 bg-white shadow-sm"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                        <div className={`p-6 rounded-full mb-6 transition-all duration-300 ${isDragActive ? "bg-green-100 text-green-600 scale-110" : "bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-green-500"}`}>
                            {isGlobalLoading ? (
                                <Loader2 className="w-16 h-16 animate-spin" />
                            ) : (
                                <UploadCloud className="w-16 h-16" />
                            )}
                        </div>
                        <div className="text-center space-y-3">
                            <p className="text-2xl font-black text-green-700">
                                {isDragActive ? "أفلت الملفات الآن" : "اسحب وأفلت الملفات هنا"}
                            </p>
                            <p className="text-gray-500 font-medium">PDF, DOC, DOCX, JPG, PNG</p>
                            <Button variant="outline" className="mt-6 rounded-full border-green-200 text-green-700 hover:bg-green-600 hover:text-white px-8 h-12 text-lg font-bold transition-all shadow-sm">
                                <Plus className="w-5 h-5 ml-2" />
                                تصفح الجهاز
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Order Items List */}
                <div className="space-y-8">
                    {orderItems.map((item) => {
                        const isWord = item.files.some(f => f.name.endsWith('.doc') || f.name.endsWith('.docx'));
                        const details = calculateItemPriceDetails(item);

                        return (
                            <Card key={item.id} className="relative overflow-hidden group border-none shadow-xl rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-6 top-6 text-red-500 hover:text-red-700 hover:bg-red-50 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="w-6 h-6" />
                                </Button>

                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Main Config Area (Cols 1-2) */}
                                        <div className="flex-1 p-8 lg:p-10 space-y-10">
                                            {/* Header: File Info */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                                <div className="p-5 bg-green-100 rounded-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                    {item.type === "document" ? <FileText className="w-10 h-10 text-green-700" /> : <ImageIcon className="w-10 h-10 text-green-700" />}
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                                        <h3 className="font-black text-2xl truncate text-green-900 leading-tight" title={item.files.map(f => f.name).join(', ')}>
                                                            {item.type === "document" ? item.files[0].name : `${item.files.length} صور`}
                                                        </h3>
                                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1.5 rounded-xl font-black text-base flex items-center gap-1.5 animate-in zoom-in-95 duration-500">
                                                            <FileDigit className="w-5 h-5" />
                                                            {item.settings.pageCount} {item.type === 'document' ? 'صفحة' : 'صورة'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="bg-green-50 text-green-700 px-5 py-2 rounded-full font-bold text-sm">
                                                            {item.type === "document" ? "مستند PDF/Word" : "مجموعة صور"}
                                                        </Badge>
                                                        {isWord && (
                                                            <Badge variant="outline" className="border-yellow-500 text-yellow-700 px-4 py-1 rounded-full font-bold flex gap-1">
                                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                                Word مكتشف
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-[2px] w-full bg-gradient-to-l from-transparent via-gray-100 to-transparent"></div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                {/* Left Col of Form */}
                                                <div className="space-y-6">
                                                    {/* Color & Ink Type */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base font-semibold text-gray-800">لون الطباعة</Label>
                                                        <div className="flex w-full p-1.5 bg-gray-100 rounded-2xl h-14">
                                                            <button
                                                                className={`flex-1 py-2 text-lg font-bold rounded-xl transition-all ${item.settings.color === "bw" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                                                onClick={() => updateItemSettings(item.id, { color: "bw" })}
                                                            >
                                                                أبيض وأسود
                                                            </button>
                                                            <button
                                                                className={`flex-1 py-2 text-lg font-bold rounded-xl transition-all ${item.settings.color === "color" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                                                onClick={() => updateItemSettings(item.id, { color: "color" })}
                                                            >
                                                                ألوان
                                                            </button>
                                                        </div>
                                                        {item.settings.color === "color" && (
                                                            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                                                                <Label className="text-sm font-semibold text-green-700 block">نوع الطباعة الملونة:</Label>
                                                                <div className="flex w-full p-1.5 bg-green-50 rounded-xl border border-green-100 h-12">
                                                                    <button
                                                                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${item.settings.inkType === "inkjet" ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-100"}`}
                                                                        onClick={() => updateItemSettings(item.id, { inkType: "inkjet" })}
                                                                    >
                                                                        مائي (Inkjet)
                                                                    </button>
                                                                    <button
                                                                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${item.settings.inkType === "laser" ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-100"}`}
                                                                        onClick={() => updateItemSettings(item.id, { inkType: "laser" })}
                                                                    >
                                                                        ليزر (Laser)
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Sides */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-base font-semibold text-gray-800">نظام الوجوه</Label>
                                                            {item.settings.pageCount === 1 && (
                                                                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-400 font-bold">ملف صفحة واحدة</Badge>
                                                            )}
                                                        </div>
                                                        <Select
                                                            value={item.settings.sides}
                                                            onValueChange={(v) => updateItemSettings(item.id, { sides: v as "single" | "double" })}
                                                            disabled={item.settings.pageCount === 1}
                                                        >
                                                            <SelectTrigger className={`w-full h-14 rounded-2xl text-lg font-bold focus:ring-green-500 ${item.settings.pageCount === 1 ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border-green-100"}`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="single">وجه واحد (Single-Sided)</SelectItem>
                                                                <SelectItem value="double">وجهين (Double-Sided)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Page Range Selection (Documents Only) */}
                                                    {item.type === "document" && item.settings.pageCount > 1 && (
                                                        <div className="space-y-3 pt-6 border-t border-gray-100">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-base font-semibold text-gray-800">نطاق الطباعة</Label>
                                                                <Badge className={item.settings.rangeType === 'all' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                                                    {item.settings.rangeType === 'all' ? 'كامل الملف' : 'نطاق مخصص'}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex w-full p-1.5 bg-gray-100 rounded-2xl h-14">
                                                                <button
                                                                    className={`flex-1 py-2 text-lg font-bold rounded-xl transition-all ${item.settings.rangeType === "all" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                                                    onClick={() => updateItemSettings(item.id, { rangeType: "all", rangeFrom: 1, rangeTo: item.settings.pageCount })}
                                                                >
                                                                    الكل
                                                                </button>
                                                                <button
                                                                    className={`flex-1 py-2 text-lg font-bold rounded-xl transition-all ${item.settings.rangeType === "custom" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                                                    onClick={() => updateItemSettings(item.id, { rangeType: "custom" })}
                                                                >
                                                                    محدد
                                                                </button>
                                                            </div>

                                                            {item.settings.rangeType === "custom" && (
                                                                <div className="grid grid-cols-2 gap-4 mt-2 animate-in zoom-in-95 duration-300">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs font-bold text-gray-400 pr-2">من صفحة</Label>
                                                                        <Input
                                                                            type="number"
                                                                            min={1}
                                                                            max={item.settings.rangeTo}
                                                                            value={item.settings.rangeFrom}
                                                                            onChange={(e) => {
                                                                                const val = Math.min(item.settings.rangeTo, Math.max(1, parseInt(e.target.value) || 1));
                                                                                updateItemSettings(item.id, { rangeFrom: val });
                                                                            }}
                                                                            className="h-14 text-center text-xl font-bold rounded-2xl border-green-100"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <Label className="text-sm font-bold text-gray-500 pr-2">إلى صفحة</Label>
                                                                        <Input
                                                                            type="number"
                                                                            min={item.settings.rangeFrom}
                                                                            max={item.settings.pageCount}
                                                                            value={item.settings.rangeTo}
                                                                            onChange={(e) => {
                                                                                const val = Math.min(item.settings.pageCount, Math.max(item.settings.rangeFrom, parseInt(e.target.value) || item.settings.pageCount));
                                                                                updateItemSettings(item.id, { rangeTo: val });
                                                                            }}
                                                                            className="h-14 text-center text-xl font-bold rounded-2xl border-green-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.type === "document" && item.settings.pageCount === 1 && (
                                                        <div className="pt-6 border-t border-gray-100">
                                                            <div className="flex items-center gap-2 text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                                <Info className="w-5 h-5 shrink-0" />
                                                                <p className="text-sm font-bold">سيتم طباعة الصفحة الوحيدة بالكامل.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Col of Form */}
                                                <div className="space-y-8">
                                                    {/* Quantity with Stepper */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base font-semibold text-gray-800">عدد النسخ الكلية</Label>
                                                        <div className="flex items-center w-full bg-white border border-green-100 rounded-2xl overflow-hidden h-14">
                                                            <button
                                                                type="button"
                                                                className="w-14 h-full bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors border-l border-green-50"
                                                                onClick={() => updateItemSettings(item.id, { quantity: Math.max(1, item.settings.quantity - 1) })}
                                                            >
                                                                <Minus className="w-5 h-5" />
                                                            </button>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={item.settings.quantity === 0 ? "" : item.settings.quantity}
                                                                onChange={(e) => {
                                                                    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                                                                    updateItemSettings(item.id, { quantity: isNaN(val) ? 1 : val });
                                                                }}
                                                                onBlur={() => {
                                                                    if (item.settings.quantity < 1) {
                                                                        updateItemSettings(item.id, { quantity: 1 });
                                                                    }
                                                                }}
                                                                className="flex-1 h-full border-none text-center font-black text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="w-14 h-full bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors border-r border-green-50"
                                                                onClick={() => updateItemSettings(item.id, { quantity: item.settings.quantity + 1 })}
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Pages per Sheet */}
                                                    <div className="space-y-3">
                                                        <Label className="text-base font-semibold text-gray-800">عدد الصفحات في الورقة</Label>
                                                        <Select
                                                            value={item.settings.pagesPerSheet.toString()}
                                                            onValueChange={(v) => updateItemSettings(item.id, { pagesPerSheet: parseInt(v) })}
                                                            disabled={item.settings.pageCount === 1}
                                                        >
                                                            <SelectTrigger className={`w-full h-14 rounded-2xl text-base font-bold px-4 ${item.settings.pageCount === 1 ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border-green-100"}`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1" className="text-base">1 (الافتراضي)</SelectItem>
                                                                {item.settings.pageCount > 1 && (
                                                                    <>
                                                                        <SelectItem value="2" className="text-base">2 (صفحتان)</SelectItem>
                                                                        <SelectItem value="4" className="text-base">4 (أربع صفحات)</SelectItem>
                                                                        <SelectItem value="6" className="text-base">6 (ست صفحات)</SelectItem>
                                                                        <SelectItem value="9" className="text-base">9 (تسع صفحات)</SelectItem>
                                                                        <SelectItem value="16" className="text-base">16 (ستة عشر صفحة)</SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Notes Field */}
                                            <div className="space-y-3 pt-10 border-t border-gray-100">
                                                <Label className="text-base font-semibold text-gray-800">ملاحظات إضافية (اختياري)</Label>
                                                <Textarea
                                                    placeholder="مثال: اطبع من صفحة 5 لـ 10 فقط، أو أي تعليمات خاصة..."
                                                    value={item.settings.notes || ""}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemSettings(item.id, { notes: e.target.value })}
                                                    className="w-full rounded-2xl border-green-100 focus:ring-green-500 min-h-[120px] p-4 text-lg font-medium"
                                                />
                                            </div>
                                        </div>

                                        {/* Detailed Receipt Sidebar (Col 3) */}
                                        <div className="lg:w-80 p-8 bg-slate-50 border-r border-gray-100 relative">
                                            {/* Receipt Header */}
                                            <div className="space-y-6 sticky top-8">
                                                <div className="flex items-center gap-3 text-green-800 border-b border-dashed border-gray-300 pb-4">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <ReceiptText className="w-6 h-6" />
                                                    </div>
                                                    <h4 className="font-black text-lg">تفاصيل التكلفة</h4>
                                                </div>

                                                {/* Logic Math */}
                                                <ul className="space-y-5">
                                                    <li className="flex justify-between items-center text-sm font-bold">
                                                        <span className="text-gray-500">سعر الورقة:</span>
                                                        <span className="text-green-800 bg-green-100 px-3 py-1 rounded-lg">{details.rate.toFixed(2)} ج.م</span>
                                                    </li>
                                                    <li className="flex flex-col gap-1 text-sm font-bold border-b border-gray-100 pb-4">
                                                        <span className="text-gray-500">حساب عدد الورق:</span>
                                                        <span className="text-gray-800 bg-white p-2 border border-gray-100 rounded-lg text-center mt-1">
                                                            {details.effectivePages} {item.settings.rangeType === 'custom' ? 'صفحة مختارة' : 'صفحة'} ÷ ({item.settings.pagesPerSheet} × {item.settings.sides === 'double' ? '2' : '1'}) = {details.sheets} ورقة
                                                        </span>
                                                    </li>
                                                    <li className="flex justify-between items-center text-sm font-bold">
                                                        <span className="text-gray-500">إجمالي النسخ:</span>
                                                        <span className="text-gray-800">× {item.settings.quantity}</span>
                                                    </li>
                                                </ul>

                                                <div className="pt-6 border-t-[3px] border-dashed border-gray-200 mt-6 relative">
                                                    <div className="absolute -top-[1.5px] -left-1 w-2 h-2 bg-slate-50 rounded-full border border-gray-200"></div>
                                                    <div className="absolute -top-[1.5px] -right-1 w-2 h-2 bg-slate-50 rounded-full border border-gray-200"></div>

                                                    <p className="text-xs text-gray-400 font-black mb-1">إجمالي الصنف</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl font-black text-green-600">{details.total.toFixed(1)}</span>
                                                        <span className="text-sm font-bold text-green-800">ج.م</span>
                                                    </div>

                                                    <div className="mt-8 flex items-start gap-3 bg-yellow-50 p-4 rounded-2xl border border-yellow-100 group/tt relative cursor-help">
                                                        <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] text-yellow-800 leading-normal font-bold">
                                                            هذا السعر تقريبي وقد يتغير بعد المراجعة اليدوية للملفات.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Footer Section: Final Summary */}
                {orderItems.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-8 pt-10 border-t border-green-200">
                        <div className="md:col-span-2">
                            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-2xl font-black text-green-900 border-r-4 border-yellow-500 pr-4">كيف تود الاستلام؟</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <label className={`flex items-center gap-6 p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${delivery === "pickup" ? "bg-green-50 border-green-500 shadow-xl scale-[1.02]" : "hover:bg-gray-50 border-gray-100"}`}>
                                            <input type="radio" name="delivery" value="pickup" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} className="w-8 h-8 accent-green-600" />
                                            <div>
                                                <p className="font-black text-xl text-green-900">استلام من المحل</p>
                                                <p className="text-sm text-muted-foreground font-bold mt-1">دمياط - ميدان سرور (مجاني)</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center gap-6 p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${delivery === "home" ? "bg-green-50 border-green-500 shadow-xl scale-[1.02]" : "hover:bg-gray-50 border-gray-100"}`}>
                                            <input type="radio" name="delivery" value="home" checked={delivery === "home"} onChange={() => setDelivery("home")} className="w-8 h-8 accent-green-600" />
                                            <div>
                                                <p className="font-black text-xl text-green-900">توصيل للمنزل</p>
                                                <p className="text-sm text-muted-foreground font-bold mt-1">رسوم التوصيل: {PRICING_CONFIG.delivery} ج.م</p>
                                            </div>
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="relative">
                            <Card className="bg-green-900 text-white shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-8">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-800 rounded-full -mr-32 -mt-32 opacity-20 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-700 rounded-full -ml-24 -mb-24 opacity-20 pointer-events-none"></div>

                                <CardHeader className="p-8 pb-4 relative">
                                    <CardTitle className="text-2xl font-black flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="w-8 h-8 text-yellow-400" />
                                            <span>الحساب النهائي</span>
                                        </div>
                                        <Badge className="bg-yellow-500 text-green-950 border-none px-4 py-1.5 rounded-full font-black text-sm">
                                            {orderItems.length} طلبات
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-8 relative">
                                    <div className="space-y-4 font-bold">
                                        <div className="flex justify-between items-center border-b border-green-800 pb-4">
                                            <span className="text-green-300">إجمالي الطباعة:</span>
                                            <span className="text-xl">{totalPrice.toFixed(2)} ج.م</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-green-800 pb-4">
                                            <span className="text-green-300">خدمة التوصيل:</span>
                                            <span className="text-xl">{delivery === "home" ? PRICING_CONFIG.delivery : 0} ج.م</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-yellow-400">المبلغ الإجمالي المستحق:</p>
                                        <p className="text-6xl font-black tracking-tighter">
                                            {(totalPrice + (delivery === "home" ? PRICING_CONFIG.delivery : 0)).toFixed(1)}
                                            <span className="text-xl font-bold mr-3">ج.م</span>
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-green-950 font-black text-3xl py-10 rounded-3xl shadow-2xl transition-all transform active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                                                جاري المعالجة...
                                            </>
                                        ) : (
                                            <>
                                                تأكيد وبدء الطباعة
                                                <Plus className="w-8 h-8 mr-4 group-hover:rotate-90 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
