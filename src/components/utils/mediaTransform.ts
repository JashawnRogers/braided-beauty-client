const API = import.meta.env.VITE_SERVER_API_URL;

export async function transformServiceCreate(data: any) {
  const toKey = async (
    fileOrKey: File | string | null,
    purpose: "service-photo" | "service-video"
  ) => {
    if (!fileOrKey) return null;
    if (typeof fileOrKey == "string") return fileOrKey; // already an S3 key

    // 1) Ask server for presigned PUT
    const presignResponse = await fetch(`${API}/media/presign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: fileOrKey.name,
        contentType: fileOrKey.type || "application/octet-stream",
        purpose,
        serviceId: data.id ?? undefined, // if editing
      }),
    });
    if (!presignResponse.ok) throw new Error("Failed to presign");
    const presigned = (await presignResponse.json()) as {
      s3Url: string;
      headers: Record<string, string>;
      s3ObjectKey: string;
      contentType: string;
      maxBytes: number;
    };

    // 2) upload via PUT
    const headers = new Headers(presigned.headers);
    headers.set("Content-Type", presigned.contentType);
    const put = await fetch(presigned.s3Url, {
      method: "PUT",
      headers,
      body: fileOrKey,
    });
    if (!put.ok) throw new Error("S3 upload failed");

    const finalizeResponse = await fetch(`${API}/media/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        s3ObjectKey: presigned.s3ObjectKey,
        expectedContentType: presigned.contentType,
        purpose,
      }),
    });
    if (!finalizeResponse.ok) throw new Error("Finalize failed");
    const finalize = await finalizeResponse.json();
    if (!finalize.valid) throw new Error("Server rejected upload media");

    return presigned.s3ObjectKey;
  };

  // Photos: array that may contain File or string keys
  const photoKeys: string[] = [];
  if (Array.isArray(data.photoFiles)) {
    for (const item of data.photoFiles) {
      // React-Admin FileInput items can be {rawFile, src, title} etc..
      const file: File | string | null =
        (item?.rawFile as File) ?? (typeof item === "string" ? item : null);
      const key = await toKey(file, "service-photo");
      if (key) photoKeys.push(key);
    }
  }

  // Video: single value
  let videoKey: string | null = null;
  if (data.videoFile) {
    const file: File | string | null =
      (data.videoFile?.rawFile as File) ??
      (typeof data.videoFile === "string" ? data.videoFile : null);
    videoKey = await toKey(file, "service-video");
  }

  // return DTO shape - ignoring binary fields
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    durationMinutes: data.durationMinutes,
    photoKeys,
    videoKey,
  };
}

export async function transformServiceEdit(
  data: any,
  options?: { previousData: any }
): Promise<any> {
  const prev = options?.previousData ?? {};
  const prevPhotos: string[] = Array.isArray(prev.photoKeys)
    ? prev.photoKeys
    : [];
  const prevVideo: string | null = prev.videoKey ?? null;
  // Upload any new files to S3 first
  const toKey = async (
    fileOrKey: File | string | null,
    purpose: "service-photo" | "service-video"
  ) => {
    if (!fileOrKey) return null;
    if (typeof fileOrKey === "string") return fileOrKey; // already uploaded

    const presignResponse = await fetch(`${API}/media/presign`, {
      method: "POST", // use POST (not PUT) to request the presigned PUT URL
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: fileOrKey.name,
        contentType: fileOrKey.type || "application/octet-stream",
        purpose,
        serviceId: data.id ?? undefined,
      }),
    });

    if (!presignResponse.ok) throw new Error("Failed to presign");
    const presigned = (await presignResponse.json()) as {
      s3Url: string;
      headers: Record<string, string>;
      s3ObjectKey: string;
      contentType: string;
      maxBytes: number;
    };

    const headers = new Headers(presigned.headers);
    headers.set("Content-Type", presigned.contentType);

    const put = await fetch(presigned.s3Url, {
      method: "PUT",
      headers,
      body: fileOrKey,
    });
    if (!put.ok) throw new Error("S3 upload failed");

    const finalizeResponse = await fetch(`${API}/media/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        s3ObjectKey: presigned.s3ObjectKey,
        expectedContentType: presigned.contentType,
        purpose,
      }),
    });

    if (!finalizeResponse.ok) throw new Error("Finalize failed");
    const finalize = await finalizeResponse.json();
    if (!finalize.valid) throw new Error("Server rejected uploaded media");

    return presigned.s3ObjectKey;
  };

  // Normalize current / previous photo keys
  // ---- derive new photo keys: keep strings, upload Files ----
  const inputPhotos: Array<File | string> = Array.isArray(data.photoFiles)
    ? data.photoFiles
    : [];
  const newPhotoKeys: string[] = [];
  for (const item of inputPhotos) {
    const key = await toKey(item, "service-photo");
    if (key) newPhotoKeys.push(key);
  }

  // add/remove diffs against previous data
  const prevSet = new Set(prevPhotos);
  const nextSet = new Set(newPhotoKeys);
  const addPhotoKeys = newPhotoKeys.filter((k) => !prevSet.has(k));
  const removePhotoKeys = prevPhotos.filter((k) => !nextSet.has(k));

  // Video (treated as "replace or leave untouched")
  let videoKey = prevVideo;
  if (data.videoFile === null) {
    videoKey = null;
  } else if (data.videoFile) {
    const file: File | string | null =
      (data.videoFile?.rawFile as File) ??
      (typeof data.videoFile === "string" ? data.videoFile : null);
    videoKey = await toKey(file, "service-video");
  }

  // Build DTO the server expects
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    depositAmount: data.depositAmount,
    durationMinutes: data.durationMinutes,
    addPhotoKeys,
    removePhotoKeys,
    // Only include videoKey if user touched it
    ...(videoKey !== undefined ? { videoKey } : {}),
  };
}
