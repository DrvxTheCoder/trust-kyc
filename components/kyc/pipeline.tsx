"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "@/components/kyc/kanban"
import { TkBadge, TypeBadge, RiskBadge } from "@/components/ui/tk-badge"
import { Customer, customers as allCustomers, workflows } from "@/lib/data"
import { IconLayoutColumns, IconList } from "@tabler/icons-react"

interface PipelinePageProps {
  customers: Customer[]
  onOpen: (c: Customer) => void
  onMove: (customerId: string, stageId: string) => void
}

export function PipelinePage({ customers, onOpen, onMove }: PipelinePageProps) {
  const [wfId, setWfId] = useState("business")
  const [view, setView] = useState<"kanban" | "list">("kanban")

  const wf = workflows.find((w) => w.id === wfId)!

  const visible = useMemo(() => {
    if (wfId === "business") return customers.filter((c) => c.type === "Business")
    if (wfId === "basic") return customers.filter((c) => c.type === "Individual")
    return customers.filter((c) => c.type === "EDD")
  }, [wfId, customers])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Onboarding Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag cards to move customers between stages</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            {workflows.map((w) => (
              <button
                key={w.id}
                onClick={() => setWfId(w.id)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  wfId === w.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-2.5 py-1.5 transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            >
              <IconLayoutColumns size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-2.5 py-1.5 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            >
              <IconList size={15} />
            </button>
          </div>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard customers={visible} stages={wf.stages} onOpen={onOpen} onMove={onMove} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <PipelineTable customers={visible} workflow={wf} onOpen={onOpen} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PipelineTable({
  customers,
  workflow,
  onOpen,
}: {
  customers: Customer[]
  workflow: (typeof workflows)[0]
  onOpen: (c: Customer) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Customer</th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Account Type</th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Stage</th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Docs</th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Days in Stage</th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Risk</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const stage = workflow.stages.find((s) => s.id === c.stage)
            return (
              <tr
                key={c.id}
                onClick={() => onOpen(c)}
                className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                </td>
                <td className="px-4 py-3"><TypeBadge type={c.type} /></td>
                <td className="px-4 py-3"><TkBadge tone="slate">{stage?.name ?? "—"}</TkBadge></td>
                <td className="px-4 py-3 font-mono text-xs">{c.docs}/{c.docsTotal}</td>
                <td className={`px-4 py-3 font-mono text-xs ${c.stuck ? "text-destructive" : "text-muted-foreground"}`}>
                  {c.daysInStage}d{c.stuck && " ⚠"}
                </td>
                <td className="px-4 py-3"><RiskBadge risk={c.risk} /></td>
              </tr>
            )
          })}
          {customers.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No customers in this workflow</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
