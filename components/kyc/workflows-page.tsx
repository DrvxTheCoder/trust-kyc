"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TkBadge } from "@/components/ui/tk-badge"
import { workflows } from "@/lib/data"
import { IconPlus, IconChevronRight, IconGripVertical, IconPencil } from "@tabler/icons-react"

function ToggleField({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Switch checked={on} onCheckedChange={setOn} className="scale-75" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </label>
  )
}

export function WorkflowsPage() {
  const [selected, setSelected] = useState("business")
  const [expanded, setExpanded] = useState("compliance")

  const wf = workflows.find((w) => w.id === selected)!
  const needsSigStages = new Set(["compliance", "approved", "ownership", "sanctions"])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Workflow Builder</h1>
          <p className="text-sm text-muted-foreground">Design onboarding workflows, required documents, and stage rules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Preview</Button>
          <Button size="sm">Publish changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px,1fr] gap-4">
        {/* Workflow list */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Workflow templates</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><IconPlus size={14} /></Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {workflows.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelected(w.id)}
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${selected === w.id ? "border-primary/40 bg-primary/5" : "hover:bg-muted/50"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{w.name}</span>
                  <TkBadge tone={w.risk === "Low" ? "green" : w.risk === "Medium" ? "amber" : "red"} dot>{w.risk}</TkBadge>
                </div>
                <div className="text-xs text-muted-foreground">{w.stages.length} stages · {w.count} active</div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2 justify-center">
              <IconPlus size={13} className="mr-1" />Create new workflow
            </Button>
          </CardContent>
        </Card>

        {/* Stage editor */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">{wf.name}</CardTitle>
                <CardDescription className="text-xs">Drag to reorder stages · click to configure</CardDescription>
              </div>
              <div className="flex gap-2">
                <TkBadge tone="blue">{wf.stages.length} stages</TkBadge>
                <TkBadge tone="slate">{wf.count} active customers</TkBadge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            {wf.stages.map((s, i) => {
              const isExp = expanded === s.id
              const needsSig = needsSigStages.has(s.id)
              const roles = ["Onboarding Agent", "Compliance Officer", "Team Lead", "Senior Auditor"]
              const requiredDocs = ["Carte Nationale d'Identité", "RCCM", "NINEA", "Justificatif de Domicile"].slice(0, (i % 3) + 2)

              return (
                <div key={s.id}>
                  {/* Stage row */}
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${isExp ? "bg-muted/50" : ""}`}
                    onClick={() => setExpanded(isExp ? "" : s.id)}
                  >
                    <IconGripVertical size={14} className="text-muted-foreground cursor-grab shrink-0" />
                    <span className="text-[10px] font-mono text-muted-foreground w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold flex-1">{s.name}</span>
                    {needsSig && <IconPencil size={13} className="text-muted-foreground shrink-0" title="Requires signature" />}
                    <TkBadge tone="slate">{roles[i % 3]}</TkBadge>
                    <IconChevronRight
                      size={14}
                      className={`text-muted-foreground transition-transform shrink-0 ${isExp ? "rotate-90" : ""}`}
                    />
                  </div>

                  {/* Expanded config */}
                  {isExp && (
                    <div className="mx-3 mb-3 border rounded-lg p-4 bg-muted/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Stage name</label>
                          <input
                            defaultValue={s.name}
                            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Assigned role</label>
                          <select className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            {["Onboarding Agent", "Compliance Officer", "Team Lead", "Senior Auditor"].map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Required documents</label>
                          <div className="flex flex-wrap gap-1.5">
                            {requiredDocs.map((d) => (
                              <TkBadge key={d} tone="outline">
                                {d} <span className="ml-1 opacity-50 cursor-pointer">×</span>
                              </TkBadge>
                            ))}
                            <TkBadge tone="blue"><span className="cursor-pointer">+ Add</span></TkBadge>
                          </div>
                        </div>
                        <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                          <ToggleField label="Allow forward" defaultOn={true} />
                          <ToggleField label="Allow backward" defaultOn={i > 0} />
                          <ToggleField label="Allow skip" defaultOn={false} />
                          <ToggleField label="Auto-advance" defaultOn={i === 1} />
                          <ToggleField label="Requires signature" defaultOn={needsSig} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Connector */}
                  {i < wf.stages.length - 1 && (
                    <div className="flex items-center justify-center py-0.5">
                      <div className="w-px h-5 bg-border relative">
                        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-5 rounded-full border bg-background flex items-center justify-center hover:bg-muted transition-colors">
                          <IconPlus size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
