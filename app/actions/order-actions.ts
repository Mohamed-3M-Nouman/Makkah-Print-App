"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadOrderFiles } from "@/utils/supabase/storage";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/database.types";

// ============================================================================
// Type Aliases from auto-generated Supabase types
// ============================================================================

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

// ============================================================================
// Input types for the server action (what the frontend sends)
// ============================================================================

export interface OrderItemInput {
    /** Original file names for display purposes */
    fileNames: string[];
    type: "document" | "image_batch";
    pageCount: number;
    color: "bw" | "color";
    inkType?: "laser" | "inkjet" | null;
    pagesPerSheet: number;
    sides: "single" | "double";
    printRange: string;
    quantity: number;
    itemPrice: number;
}

export interface SubmitOrderInput {
    serviceType: "print" | "stationery" | "design";
    delivery: "pickup" | "home";
    paymentMethod: "cash" | "wallet";
    totalPrice: number;
    deliveryFee: number;
    notes?: string;
    items: OrderItemInput[];
}

export interface OrderActionResult {
    success: boolean;
    orderId?: number;
    error?: string;
}

// ============================================================================
// submitNewOrder — Main Server Action
// ============================================================================

/**
 * Server Action: Submit a new print order.
 *
 * Flow:
 *   1. Authenticate the user via Supabase session.
 *   2. Insert a new row into the `orders` table (status: 'pending_review').
 *   3. Upload all files to Supabase Storage under `print_files/{orderId}/`.
 *   4. Insert rows into `order_items` with file URLs and print specifications.
 *   5. Revalidate the orders page cache.
 *
 * @param orderData  - The order metadata and item specs.
 * @param formData   - FormData containing the files. Each item's files should
 *                     be appended as `files_0`, `files_1`, etc. matching item index.
 *                     Multiple files for one item use the same key (e.g., `files_0`).
 */
export async function submitNewOrder(
    orderData: SubmitOrderInput,
    formData: FormData
): Promise<OrderActionResult> {
    try {
        const supabase = await createClient();

        // ----------------------------------------------------------------
        // Step 1: Authenticate — get the current user
        // ----------------------------------------------------------------
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: "يجب تسجيل الدخول أولاً لتقديم طلب.",
            };
        }

        // ----------------------------------------------------------------
        // Step 2: Insert order into `orders` table
        // ----------------------------------------------------------------
        const orderPayload: OrderInsert = {
            customer_id: user.id,
            status: "pending_review",
            service_type: orderData.serviceType,
            delivery: orderData.delivery,
            payment_method: orderData.paymentMethod,
            total_price: orderData.totalPrice,
            delivery_fee: orderData.deliveryFee,
            notes: orderData.notes || null,
        };

        const { data: newOrder, error: orderError } = await supabase
            .from("orders")
            .insert(orderPayload)
            .select("id")
            .single();

        if (orderError || !newOrder) {
            console.error("[Order Action] Insert order failed:", orderError?.message);
            return {
                success: false,
                error: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
            };
        }

        const orderId = newOrder.id;

        // ----------------------------------------------------------------
        // Step 3 & 4: Process each item — upload files, then insert item row
        // ----------------------------------------------------------------
        const itemInsertPromises = orderData.items.map(async (item, index) => {
            // Extract files for this item from FormData (key: `files_0`, `files_1`, ...)
            const itemFiles = formData.getAll(`files_${index}`) as File[];

            let fileUrls: string[] = [];

            // Upload files if any were provided
            if (itemFiles.length > 0 && itemFiles[0]?.size > 0) {
                fileUrls = await uploadOrderFiles(
                    itemFiles,
                    orderId.toString()
                );
            }

            // Build the order_items row
            const itemPayload: OrderItemInsert = {
                order_id: orderId,
                file_names: item.fileNames,
                file_urls: fileUrls,
                type: item.type,
                page_count: item.pageCount,
                color: item.color,
                ink_type: item.inkType || null,
                pages_per_sheet: item.pagesPerSheet,
                sides: item.sides,
                print_range: item.printRange,
                quantity: item.quantity,
                item_price: item.itemPrice,
            };

            const { error: itemError } = await supabase
                .from("order_items")
                .insert(itemPayload);

            if (itemError) {
                console.error(
                    `[Order Action] Insert item #${index} failed:`,
                    itemError.message
                );
                throw new Error(
                    `فشل حفظ عنصر الطلب رقم ${index + 1}: ${itemError.message}`
                );
            }
        });

        // Wait for all items to be processed
        await Promise.all(itemInsertPromises);

        // ----------------------------------------------------------------
        // Step 5: Revalidate cached pages
        // ----------------------------------------------------------------
        revalidatePath("/home", "layout");
        revalidatePath("/operator/dashboard", "layout");

        return {
            success: true,
            orderId: orderId,
        };
    } catch (err) {
        console.error("[Order Action] Unexpected error:", err);
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.",
        };
    }
}

// ============================================================================
// getCustomerOrders — Fetch orders for the logged-in customer
// ============================================================================

/**
 * Fetch all orders belonging to the authenticated customer,
 * including their order items. Ordered by most recent first.
 */
export async function getCustomerOrders(): Promise<{
    success: boolean;
    orders?: (OrderRow & { order_items: OrderItemRow[] })[];
    error?: string;
}> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "غير مصرح. يرجى تسجيل الدخول." };
        }

        const { data, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[Order Action] Fetch orders failed:", error.message);
            return { success: false, error: "فشل تحميل الطلبات." };
        }

        return { success: true, orders: data };
    } catch (err) {
        console.error("[Order Action] Unexpected error:", err);
        return { success: false, error: "حدث خطأ غير متوقع." };
    }
}

// ============================================================================
// updateOrderStatus — Operator action to change order status
// ============================================================================

/**
 * Update the status of an order. Only callable by operators/admins
 * (enforced by RLS policies on the `orders` table).
 */
export async function updateOrderStatus(
    orderId: number,
    newStatus: Database["public"]["Enums"]["order_status"]
): Promise<OrderActionResult> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "غير مصرح." };
        }

        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId);

        if (error) {
            console.error("[Order Action] Status update failed:", error.message);
            return {
                success: false,
                error: "فشل تحديث حالة الطلب.",
            };
        }

        revalidatePath("/operator/dashboard", "layout");
        revalidatePath("/home", "layout");

        return { success: true, orderId };
    } catch (err) {
        console.error("[Order Action] Unexpected error:", err);
        return { success: false, error: "حدث خطأ غير متوقع." };
    }
}
