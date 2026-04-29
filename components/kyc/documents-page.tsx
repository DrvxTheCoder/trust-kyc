"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TkBadge, StatusBadge } from "@/components/ui/tk-badge"
import { documents as allDocuments, docTypes, fmtDate } from "@/lib/data"
import {
  IconDownload, IconUpload, IconSearch, IconFileText,
  IconCalendar, IconAlertTriangle, IconFlag, IconEye,
} from "@tabler/icons-react"

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: number | string; icon: React.ElementType; tone: "info" | "warn" | "danger" }) {
  const toneClass = {
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  }[tone]

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-semibold">{label}</span>
        <div className={`size-7 rounded-lg flex items-center justify-center ${toneClass}`}>
          <Icon size={14} />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

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
        <span className="max-w-[100px] truncate">{value}</span>
        <span className="text-muted-foreground ml-0.5">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 min-w-[160px] z-30 bg-popover border rounded-lg shadow-lg p-1 max-h-56 overflow-y-auto">
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

export function DocumentsPage() {
  const router = useRouter()
  const [filterType, setFilterType] = useState("All types")
  const [filterStatus, setFilterStatus] = useState("All statuses")
  const [query, setQuery] = useState("")

  const docs = useMemo(() => {
    return allDocuments.filter((d) => {
      if (filterType !== "All types" && d.type !== filterType) return false
      if (filterStatus !== "All statuses") {
        const s = filterStatus.toLowerCase().replace(" soon", "")
        if (d.status !== s) return false
      }
      if (query && !d.customer.toLowerCase().includes(query.toLowerCase()) && !d.type.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [filterType, filterStatus, query])

  const stats = {
    total: allDocuments.length + 1844,
    expiring30: allDocuments.filter((d) => d.status === "expiring").length + 9,
    expired: allDocuments.filter((d) => d.status === "expired").length + 3,
    missing: 14,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground">Global archive across all customers · OCR & signature verification enabled</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><IconDownload size={14} className="mr-1" />Export CSV</Button>
          <Button size="sm"><IconUpload size={14} className="mr-1" />Upload document</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Documents" value={stats.total.toLocaleString()} icon={IconFileText} tone="info" />
        <MiniStat label="Expiring in 30 days" value={stats.expiring30} icon={IconCalendar} tone="warn" />
        <MiniStat label="Expired" value={stats.expired} icon={IconAlertTriangle} tone="danger" />
        <MiniStat label="Missing Documents" value={stats.missing} icon={IconFlag} tone="danger" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer, document type, or ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <SelectFilter label="Type" value={filterType} options={["All types", ...docTypes]} onChange={setFilterType} />
            <SelectFilter label="Status" value={filterStatus} options={["All statuses", "Valid", "Expiring soon", "Expired", "Missing"]} onChange={setFilterStatus} />
            <SelectFilter label="Date" value="Last 90 days" options={["Last 7 days", "Last 30 days", "Last 90 days", "All time"]} onChange={() => {}} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Document</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Customer</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Uploaded</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Expires</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Uploaded by</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Stage</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => router.push(`/dashboard/customers/${d.customerId}`)}
                    className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-xs">{d.type}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{d.id}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-xs">{d.customer}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{d.customerId}</div>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground">{fmtDate(d.uploaded)}</td>
                    <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground">{fmtDate(d.expires)}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={d.status} /></td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.by}</td>
                    <td className="px-3 py-2.5"><TkBadge tone="slate">{d.stage}</TkBadge></td>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><IconEye size={13} /></Button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-8 text-center text-xs text-muted-foreground">No documents match these filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
