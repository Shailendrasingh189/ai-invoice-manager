import { cn } from "@/lib/utils";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size = 40, className }) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-(--accent-soft) text-(--accent-strong) font-semibold overflow-hidden ring-2 ring-(--surface)",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials(name) || "?"}</span>
      )}
    </div>
  );
}
