import { apiPost } from "./apiClient";

type PresignPutResponse = {
  s3Url: string;
  headers: Record<string, string>; // ✅ JSON object from server
  s3ObjectKey: string;
  contentType: string;
  maxBytes: number;
};

type FinalizeResponse = {
  s3ObjectKey: string;
  contentType: string;
  contentLength: number;
  valid: boolean;
};

type UploadPurpose = "service-photo";

/**
 * React-Admin FileInput items can be:
 *  - { rawFile: File, src: string, title?: string }
 *  - string (already an s3 key)
 *  - File (rare, but possible)
 */
function extractFileOrKey(item: any): File | string | null {
  if (!item) return null;
  if (typeof item === "string") return item; // already an S3 key
  if (item instanceof File) return item;
  if (item?.rawFile instanceof File) return item.rawFile;
  return null;
}

async function uploadToS3AndReturnKey(
  fileOrKey: File | string | null,
  purpose: UploadPurpose,
  serviceId?: string
): Promise<string | null> {
  if (!fileOrKey) return null;
  if (typeof fileOrKey === "string") return fileOrKey; // already uploaded

  // 1) Ask YOUR server for presigned PUT
  const presigned = await apiPost<PresignPutResponse>("/media/presign-put", {
    fileName: fileOrKey.name,
    contentType: fileOrKey.type || "application/octet-stream",
    purpose,
    serviceId: serviceId ?? null,
  });

  // 2) PUT bytes to S3 (raw fetch)
  const s3Headers = new Headers(presigned.headers);
  // Always include content-type that matches what server presigned
  s3Headers.set("Content-Type", presigned.contentType);

  const putRes = await fetch(presigned.s3Url, {
    method: "PUT",
    headers: s3Headers,
    body: fileOrKey,
  });

  if (!putRes.ok) {
    // This will be 403 most times if signature/headers mismatch
    const text = await putRes.text().catch(() => "");
    throw new Error(`S3 upload failed (${putRes.status}): ${text}`);
  }

  // 3) Finalize on YOUR server (must be authorized)
  const finalize = await apiPost<FinalizeResponse>("/media/finalize", {
    s3ObjectKey: presigned.s3ObjectKey,
    expectedContentType: presigned.contentType,
    purpose,
  });

  if (!finalize.valid) {
    throw new Error("Server rejected uploaded media (finalize.valid=false)");
  }

  return presigned.s3ObjectKey;
}

/** CREATE transform */
export async function transformServiceCreate(data: any) {
  const photoKeys: string[] = [];

  // IMPORTANT: FileInput source must match this field name in your form:
  // If your FileInput is source="photoFiles", then use data.photoFiles.
  const inputs = Array.isArray(data.photoFiles) ? data.photoFiles : [];

  for (const item of inputs) {
    const fileOrKey = extractFileOrKey(item);
    const key = await uploadToS3AndReturnKey(fileOrKey, "service-photo");
    if (key) photoKeys.push(key);
  }

  return {
    name: data.name,
    categoryId: data.categoryId,
    description: data.description,
    price: data.price,
    durationMinutes: data.durationMinutes,
    photoKeys,
  };
}

/** EDIT transform */
export async function transformServiceEdit(
  data: any,
  options?: { previousData: any }
): Promise<any> {
  const prev = options?.previousData ?? {};
  const prevPhotos: string[] = Array.isArray(prev.photoKeys)
    ? prev.photoKeys
    : [];

  // Source must match your FileInput:
  const inputs = Array.isArray(data.photoFiles) ? data.photoFiles : [];

  // Convert current UI value → array of keys (upload Files, keep existing strings)
  const nextKeys: string[] = [];
  for (const item of inputs) {
    const fileOrKey = extractFileOrKey(item);
    const key = await uploadToS3AndReturnKey(
      fileOrKey,
      "service-photo",
      data.id
    );
    if (key) nextKeys.push(key);
  }

  // Diff vs previous keys for incremental add/remove
  const prevSet = new Set(prevPhotos);
  const nextSet = new Set(nextKeys);

  const addPhotoKeys = nextKeys.filter((k) => !prevSet.has(k));
  const removePhotoKeys = prevPhotos.filter((k) => !nextSet.has(k));

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    depositAmount: data.depositAmount,
    durationMinutes: data.durationMinutes,
    addPhotoKeys,
    removePhotoKeys,
    addOnIds: data.addOnIds,
  };
}
