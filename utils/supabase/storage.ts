import { createClient } from "@/utils/supabase/server";

const BUCKET_NAME = "print_files";

/**
 * Upload a single file to the `print_files` Supabase Storage bucket.
 *
 * Files are organized by order ID: `print_files/{orderId}/{fileName}`
 *
 * @param file     - The File object to upload.
 * @param orderId  - The database order ID used as the folder prefix.
 * @returns        - The public URL of the uploaded file.
 * @throws         - Throws if the upload or URL generation fails.
 */
export async function uploadOrderFile(
    file: File,
    orderId: string
): Promise<string> {
    const supabase = await createClient();

    // Sanitize the filename: replace spaces with underscores, keep extension
    const safeName = file.name.replace(/\s+/g, "_");
    const filePath = `${orderId}/${safeName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: "3600",
            // Allow overwriting if user re-submits the same file
            upsert: true,
        });

    if (error) {
        console.error("[Storage] Upload failed:", error.message);
        throw new Error(`فشل رفع الملف: ${file.name}`);
    }

    // Generate the public URL for the uploaded file
    const {
        data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Upload multiple files for a single order in parallel.
 *
 * @param files    - Array of File objects to upload.
 * @param orderId  - The database order ID.
 * @returns        - Array of public URLs in the same order as the input files.
 */
export async function uploadOrderFiles(
    files: File[],
    orderId: string
): Promise<string[]> {
    const uploadPromises = files.map((file) => uploadOrderFile(file, orderId));
    return Promise.all(uploadPromises);
}
