import { cn } from "@/lib/utils"
import { WorkflowStage, fmtDate } from "@/lib/data"
import { IconPencil } from "@tabler/icons-react"

interface StepperProps {
  stages: WorkflowStage[]
  currentStageId: string
  daysInStage: number
  created: string
}

const completedValidators = ["Khady Ndoye", "Moussa Kane", "Awa Diagne", "Ibrahima Cissé"]

function daysAgoFromToday(n: number): string {
  const d = new Date("2026-04-25")
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function Stepper({ stages, currentStageId, daysInStage, created }: StepperProps) {
  const currentIdx = stages.findIndex((s) => s.id === currentStageId)
  const needsSigStages = new Set(["compliance", "approved", "ownership", "sanctions"])

  return (
    <div className="flex flex-col gap-0">
      {stages.map((stage, i) => {
        const done = i < currentIdx
        const current = i === currentIdx
        const needsSig = needsSigStages.has(stage.id)

        return (
          <div key={stage.id} className="flex gap-3">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "size-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 z-10",
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              {i < stages.length - 1 && (
                <div className={cn("w-0.5 flex-1 my-1", done ? "bg-emerald-500/40" : "bg-border")} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-4 flex-1 min-w-0", i === stages.length - 1 && "pb-0")}>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    done ? "text-foreground" : current ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stage.name}
                </span>
                {needsSig && (
                  <IconPencil size={13} className="text-muted-foreground shrink-0" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {done && (
                  <>Validated by <strong>{completedValidators[i % completedValidators.length]}</strong> · {fmtDate(daysAgoFromToday(15 - i * 2))}</>
                )}
                {current && (
                  <>In progress · Started {daysInStage}d ago</>
                )}
                {!done && !current && "Pending"}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
