import { useInput, FieldTitle } from "ra-core";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Choice = Record<string, unknown>;

type RASelectProps = {
  source: string;
  label?: string | false;
  choices: Choice[];
  optionValue?: string; // defaults to 'id'
  optionText?: string; // defaults to 'name'
  placeholder?: string;

  /** Width / styling */
  triggerClassName?: string; // width & input styles for the "field"
  contentClassName?: string; // width/height/scroll for the dropdown

  // passthroughs from RA
  validate?: any;
  format?: (value: any) => any;
  parse?: (value: any) => any;
  defaultValue?: any;

  /** Optional: extra wrapper styles */
  className?: string;
};

export default function RASelect({
  source,
  label,
  choices,
  optionValue = "id",
  optionText = "name",
  placeholder = "Select…",
  className,
  triggerClassName,
  contentClassName,
  validate,
  format,
  parse,
  defaultValue,
}: RASelectProps) {
  const {
    field, // { name, value, onChange, onBlur, ref }
    fieldState: { error, invalid },
    id,
    isRequired,
  } = useInput({
    source,
    validate,
    parse,
    format,
    defaultValue,
  });

  // Let Radix show the placeholder when value is undefined
  const valueForRadix =
    field.value === null || field.value === undefined
      ? undefined
      : String(field.value);

  return (
    <div className={cn(className)}>
      {label !== false && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium">
          <FieldTitle
            label={label}
            source={source}
            isRequired={isRequired}
            resource=""
          />
        </label>
      )}

      <Select
        value={valueForRadix}
        onValueChange={(v) => field.onChange(v)}
        onOpenChange={(open) => {
          if (!open) field.onBlur(); // mark touched when the menu closes
        }}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "w-48", // default width; override via triggerClassName
            invalid && "border-red-500",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={6}
          className={cn(
            "max-h-64 overflow-y-auto",
            // Make dropdown at least as wide as trigger:
            "min-w-[var(--radix-select-trigger-width)]",
            contentClassName
          )}
        >
          {choices.map((c, idx) => {
            const val = String(c[optionValue] ?? "");
            const text = String(c[optionText] ?? val);
            return (
              <SelectItem key={`${val}-${idx}`} value={val}>
                {text}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {invalid && <p className="mt-1 text-xs text-red-600">{error?.message}</p>}
    </div>
  );
}
