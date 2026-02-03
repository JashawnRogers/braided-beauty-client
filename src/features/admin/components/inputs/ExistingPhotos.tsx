import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

type PhotoItem = {
  src?: string;
  title?: string; // existing photos store S3 key here
  rawFile?: File; // new uploads
};

export default function ExistingPhotos() {
  const { setValue } = useFormContext();
  const photoFiles: PhotoItem[] = useWatch({ name: "photoFiles" }) ?? [];

  if (!photoFiles.length) return null;

  const removeAt = (idx: number) => {
    const next = photoFiles.filter((_, i) => i !== idx);
    setValue("photoFiles", next, { shouldDirty: true, shouldTouch: true });
  };

  const badgeClass =
    "absolute left-1 bottom-1 rounded-full px-2 py-0.5 text-[10px] font-medium " +
    "backdrop-blur bg-background/80 border shadow-sm";

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        Photos ({photoFiles.length})
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photoFiles.map((item, idx) => {
          const isNew = item?.rawFile instanceof File;
          const isSaved = !!item?.title && !isNew;

          const src =
            item?.src ??
            (isNew ? URL.createObjectURL(item.rawFile as File) : null);

          if (!src) return null;

          return (
            <div key={`${item.title ?? "new"}-${idx}`} className="relative">
              <img
                src={src}
                alt="Service"
                className="h-20 w-full rounded object-cover border"
              />

              {/* Badge */}
              {isNew ? (
                <span className={badgeClass}>New</span>
              ) : isSaved ? (
                <span className={badgeClass}>Saved</span>
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
