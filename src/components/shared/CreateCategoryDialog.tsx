import { useState } from "react";
import { useCreateSuggestionContext } from "react-admin";
import { useDataProvider, useNotify } from "ra-core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function CreateCategoryDialog() {
  const { onCancel, onCreate, filter } = useCreateSuggestionContext();
  const [name, setName] = useState(filter ?? "");
  const [saving, setSaving] = useState(false);

  const dataProvider = useDataProvider();
  const notify = useNotify();

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      setSaving(true);
      const { data } = await dataProvider.create("categories", {
        data: { name: trimmed },
      });
      onCreate({ id: data.id, name: data.name });
      notify(`Category ${data.name} created`, { type: "success" });
    } catch (e: any) {
      notify(e?.message ?? "Failed to create category", { type: "warning" });
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSave();
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-category">Name</Label>
            <Input
              id="new-category"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
