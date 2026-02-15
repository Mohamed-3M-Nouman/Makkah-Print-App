export type OrderStatus =
    | "pending_review"
    | "confirmed"
    | "printing"
    | "completed"
    | "out_for_delivery"
    | "delivered";

export interface OrderItem {
    fileName: string | string[];
    type: "document" | "image_batch";
    pageCount: number;
    color: "bw" | "color";
    inkType?: string;
    sides: "single" | "double";
    binding: string;
    staplePosition?: string;
    quantity: number;
    itemPrice?: number;
}

export interface Order {
    id: number;
    date: string;
    status: OrderStatus;
    serviceType: 'print' | 'stationery' | 'design';
    items: OrderItem[];
    delivery: "pickup" | "home";
    paymentMethod: 'cash' | 'wallet';
    customerName?: string;
    customerEmail?: string;
    totalPrice: number;
    notes?: string;
}

export const mockOrders: Order[] = [
    {
        id: 1,
        date: "2026-01-28",
        status: "pending_review",
        serviceType: 'print',
        paymentMethod: 'cash',
        items: [
            {
                fileName: "contract-document.pdf",
                type: "document",
                pageCount: 10,
                color: "bw",
                sides: "double",
                binding: "staple",
                quantity: 5,
                itemPrice: 25.00
            }
        ],
        delivery: "pickup",
        customerName: "أحمد محمد",
        customerEmail: "ahmed@example.com",
        totalPrice: 125.00
    },
    {
        id: 2,
        date: "2026-01-29",
        status: "printing",
        serviceType: 'print',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: "presentation-slides.pdf",
                type: "document",
                pageCount: 15,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 10,
                itemPrice: 45.00
            },
            {
                fileName: ["img1.jpg", "img2.jpg"],
                type: "image_batch",
                pageCount: 2,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 1,
                itemPrice: 15.00
            }
        ],
        delivery: "home",
        customerName: "فاطمة علي",
        customerEmail: "fatima@example.com",
        totalPrice: 465.00
    },
    {
        id: 3,
        date: "2026-01-27",
        status: "delivered",
        serviceType: 'print',
        paymentMethod: 'cash',
        items: [
            {
                fileName: "thesis-final.pdf",
                type: "document",
                pageCount: 50,
                color: "bw",
                sides: "double",
                binding: "wire",
                quantity: 3,
                itemPrice: 85.00
            }
        ],
        delivery: "pickup",
        customerName: "محمد حسن",
        customerEmail: "mohamed@example.com",
        totalPrice: 255.00
    },
    {
        id: 4,
        date: "2026-01-30",
        status: "completed",
        serviceType: 'print',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: ["photo1.png", "photo2.png", "photo3.png"],
                type: "image_batch",
                pageCount: 3,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 20,
                itemPrice: 20.00
            }
        ],
        delivery: "home",
        customerName: "سارة خالد",
        customerEmail: "sara@example.com",
        totalPrice: 400.00
    },
    {
        id: 7,
        date: "2026-02-15",
        status: "confirmed",
        serviceType: 'stationery',
        paymentMethod: 'cash',
        items: [
            {
                fileName: "أوراق A4 + أقلام",
                type: "document",
                pageCount: 1,
                color: "bw",
                sides: "single",
                binding: "none",
                quantity: 1,
                itemPrice: 45.00
            }
        ],
        delivery: "home",
        customerName: "أحمد محمد",
        customerEmail: "ahmed@example.com",
        totalPrice: 45.00
    },
    {
        id: 8,
        date: "2026-02-14",
        status: "pending_review",
        serviceType: 'design',
        paymentMethod: 'wallet',
        items: [
            {
                fileName: "تصميم شعار شخصي",
                type: "document",
                pageCount: 1,
                color: "color",
                sides: "single",
                binding: "none",
                quantity: 1,
                itemPrice: 150.00
            }
        ],
        delivery: "pickup",
        customerName: "أحمد محمد",
        customerEmail: "ahmed@example.com",
        totalPrice: 150.00
    }
];

export const getMockOrderById = (id: number): Order | undefined => {
    return mockOrders.find(o => o.id === id);
};
