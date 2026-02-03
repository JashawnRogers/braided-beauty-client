import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

type PhotoItem = {
  src?: string; // existing S3 URL
  title?: string; // S3 key (existing)
  rawFile?: File; // newly added photo
};

export default function ExistingPhotos() {
  const { setValue } = useFormContext();

  // stable fallback (avoids dependency warning + unnecessary reruns)
  const empty: PhotoItem[] = [];
  const photoFiles: PhotoItem[] = useWatch({ name: "photoFiles" }) ?? empty;

  const previews = useMemo(() => {
    return photoFiles.map((item) => {
      const isNew = item?.rawFile instanceof File;
      const isSaved = !isNew && (!!item?.title || !!item?.src);

      // Existing saved photos: server-provided URL
      if (item?.src) {
        return { ...item, previewUrl: item.src, isNew, isSaved };
      }

      // New uploads: create object URL once
      if (item.rawFile instanceof File) {
        return {
          ...item,
          previewUrl: URL.createObjectURL(item.rawFile),
          isNew,
          isSaved,
        };
      }

      return null;
    });
  }, [photoFiles]);

  // cleanup object URLs for new uploads
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p?.isNew && p.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
    };
  }, [previews]);

  if (!previews.length) return null;

  const removeAt = (idx: number) => {
    const next = photoFiles.filter((_, i) => i !== idx);
    setValue("photoFiles", next, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        Photos ({previews.filter(Boolean).length})
      </div>

      <div className="grid grid-cols-3 gap-2">
        {previews.map((item, idx) => {
          if (!item?.previewUrl) return null;

          return (
            <div key={`${item.title ?? "new"}-${idx}`} className="relative">
              <img
                src={item.previewUrl}
                alt="Service photo"
                className="h-20 w-full rounded object-cover border"
              />

              {/* Badge */}
              {item.isNew || item.isSaved ? (
                <span
                  className={[
                    "absolute left-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    "border shadow-sm",
                    item.isNew
                      ? "bg-primary text-primary-foreground border-primary/40"
                      : "bg-muted text-foreground border-border",
                  ].join(" ")}
                >
                  {item.isNew ? "New" : "Existing"}
                </span>
              ) : null}

              {/* Remove */}
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-1 top-1 h-7 w-7 rounded-full"
                onClick={() => removeAt(idx)}
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Removing a photo here will delete it after you click{" "}
        <strong>Save</strong>.
      </p>
    </div>
  );
}
