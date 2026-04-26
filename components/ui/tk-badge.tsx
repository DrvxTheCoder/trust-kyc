import { cn } from "@/lib/utils"

type BadgeTone =
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "violet"
  | "slate"
  | "outline"
  | "teal"

interface TkBadgeProps {
  tone?: BadgeTone
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  red: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
  slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/15",
  outline: "bg-transparent text-foreground border-border",
  teal: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20",
}

const dotClasses: Record<BadgeTone, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  slate: "bg-slate-500",
  outline: "bg-foreground",
  teal: "bg-teal-500",
}

export function TkBadge({ tone = "slate", dot = false, children, className }: TkBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {dot && (
        <span className={cn("size-1.5 rounded-full shrink-0", dotClasses[tone])} />
      )}
      {children}
    </span>
  )
}

export function RiskBadge({ risk }: { risk: string }) {
  const tone = risk === "Low" ? "green" : risk === "Medium" ? "amber" : "red"
  return <TkBadge tone={tone} dot>{risk} risk</TkBadge>
}

export function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { tone: BadgeTone; label: string }> = {
    Individual: { tone: "blue", label: "Basic Individual" },
    Business: { tone: "violet", label: "Business Account" },
    EDD: { tone: "red", label: "Enhanced DD" },
  }
  const m = map[type] ?? { tone: "slate" as BadgeTone, label: type }
  return <TkBadge tone={m.tone}>{m.label}</TkBadge>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: BadgeTone; label: string }> = {
    valid: { tone: "green", label: "Valid" },
    expiring: { tone: "amber", label: "Expiring soon" },
    expired: { tone: "red", label: "Expired" },
    missing: { tone: "red", label: "Missing" },
  }
  const m = map[status] ?? { tone: "slate" as BadgeTone, label: status }
  return <TkBadge tone={m.tone} dot>{m.label}</TkBadge>
}

export function ActionBadge({ action }: { action: string }) {
  const map: Record<string, BadgeTone> = {
    "Document Upload": "blue",
    "Stage Transition": "violet",
    Approval: "green",
    Rejection: "red",
    Flagged: "amber",
    "Role Change": "slate",
    "Report Generation": "slate",
    "Alert Generated": "red",
  }
  return <TkBadge tone={map[action] ?? "slate"}>{action}</TkBadge>
}
