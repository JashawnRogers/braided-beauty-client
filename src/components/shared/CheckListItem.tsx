export default function ChecklistItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? "text-emerald-600" : "text-zinc-500"
      }`}
    >
      <span className="inline-block w-4">{ok ? "✓" : "•"}</span>
      <span>{children}</span>
    </li>
  );
}
