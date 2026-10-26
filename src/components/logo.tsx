import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="CrackNcode Academy হোম">
      <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-navy bg-orange text-navy shadow-[2px_2px_0_var(--shadow-color)]">
        <span className="font-mono text-[13px] font-bold leading-none tracking-tighter">&lt;/&gt;</span>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[1.35rem] font-extrabold tracking-tight">
          CrackNcode
        </span>
        {!compact && (
          <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted">
            Academy
          </span>
        )}
      </span>
    </Link>
  );
}
