"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TkBadge, ActionBadge } from "@/components/ui/tk-badge"
import { activity, team, customers as allCustomers, fmtDate, relTime } from "@/lib/data"
import { IconDownload, IconChevronRight } from "@tabler/icons-react"

function SelectFilter({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="max-w-[110px] truncate">{value}</span>
        <span className="text-muted-foreground ml-0.5">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 min-w-[160px] z-30 bg-popover border rounded-lg shadow-lg p-1 max-h-60 overflow-y-auto">
            {options.map((o) => (
              <div
                key={o}
                onClick={() => { onChange(o); setOpen(false) }}
                className={`px-2.5 py-1.5 rounded-md text-xs cursor-pointer hover:bg-muted transition-colors ${o === value ? "text-primary font-semibold bg-primary/10" : ""}`}
              >
                {o}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function formatTimestamp(t: string) {
  const d = new Date(t)
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", "")
}

export function ActivityLog() {
  const [filterUser, setFilterUser] = useState("All users")
  const [filterAction, setFilterAction] = useState("All actions")
  const [expanded, setExpanded] = useState<number | null>(null)

  const items = useMemo(() =>
    activity.filter((a) => {
      if (filterUser !== "All users" && a.user !== filterUser) return false
      if (filterAction !== "All actions" && a.action !== filterAction) return false
      return true
    }),
    [filterUser, filterAction]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Immutable audit trail · {activity.length * 14} events this month</p>
        </div>
        <Button variant="outline" size="sm"><IconDownload size={14} className="mr-1" />Export audit trail</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <SelectFilter label="User" value={filterUser} options={["All users", ...team.map((t) => t.name), "System"]} onChange={setFilterUser} />
            <SelectFilter label="Action" value={filterAction} options={["All actions", "Document Upload", "Stage Transition", "Approval", "Rejection", "Flagged", "Role Change", "Report Generation", "Alert Generated"]} onChange={setFilterAction} />
            <SelectFilter label="Customer" value="All customers" options={["All customers", ...allCustomers.map((c) => c.name)]} onChange={() => {}} />
            <SelectFilter label="Date" value="Last 7 days" options={["Today", "Last 7 days", "Last 30 days", "All time"]} onChange={() => {}} />
            <span className="ml-auto text-xs text-muted-foreground font-mono">{items.length} events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground w-28">Timestamp</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Action</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Customer</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Details</th>
                  <th className="px-3 py-2 w-8" />
                </tr>
              </thead>
              <tbody>
                {items.map((a, i) => (
                  <>
                    <tr
                      key={i}
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="border-b hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{formatTimestamp(a.t)}</td>
                      <td className="px-3 py-2.5">
                        <div className="text-xs font-semibold">{a.user}</div>
                        <div className="text-[10px] text-muted-foreground">{a.role}</div>
                      </td>
                      <td className="px-3 py-2.5"><ActionBadge action={a.action} /></td>
                      <td className="px-3 py-2.5 text-xs">{a.customer}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-xs truncate">{a.detail}</td>
                      <td className="px-3 py-2.5 text-right">
                        <IconChevronRight
                          size={14}
                          className={`text-muted-foreground transition-transform ${expanded === i ? "rotate-90" : ""}`}
                        />
                      </td>
                    </tr>
                    {expanded === i && (
                      <tr key={`${i}-expanded`} className="bg-primary/3 border-b">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-[10px] text-muted-foreground font-semibold mb-1">EVENT ID</div>
                              <div className="text-xs font-mono">EVT-{String(90000 + i)}</div>
                            </div>
                            {a.direction && (
                              <div>
                                <div className="text-[10px] text-muted-foreground font-semibold mb-1">DIRECTION</div>
                                <TkBadge tone={a.direction === "forward" ? "green" : "amber"}>{a.direction}</TkBadge>
                              </div>
                            )}
                            {a.reason && (
                              <div>
                                <div className="text-[10px] text-muted-foreground font-semibold mb-1">REASON</div>
                                <div className="text-xs">{a.reason}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-[10px] text-muted-foreground font-semibold mb-1">IP ADDRESS</div>
                              <div className="text-xs font-mono">196.207.14.{92 + i}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-xs text-muted-foreground">No events match these filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
