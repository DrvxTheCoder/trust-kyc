"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TkBadge, TypeBadge, RiskBadge } from "@/components/ui/tk-badge"
import { Customer, fmtDate } from "@/lib/data"
import { IconDownload, IconPlus } from "@tabler/icons-react"

export function CustomersList({ customers, onOpen }: { customers: Customer[]; onOpen: (c: Customer) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} in active onboarding · 1,714 approved</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><IconDownload size={14} className="mr-1" />Export</Button>
          <Button size="sm"><IconPlus size={14} className="mr-1" />New customer</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Customer</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Account type</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Risk</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Stage</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Docs</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Days</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onOpen(c)}
                    className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.initials}
                        </div>
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.company ?? c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={c.type} /></td>
                    <td className="px-4 py-3"><RiskBadge risk={c.risk} /></td>
                    <td className="px-4 py-3"><TkBadge tone="slate">{c.stage}</TkBadge></td>
                    <td className="px-4 py-3 font-mono text-xs">{c.docs}/{c.docsTotal}</td>
                    <td className={`px-4 py-3 font-mono text-xs ${c.stuck ? "text-destructive" : "text-muted-foreground"}`}>
                      {c.daysInStage}d{c.stuck && " ⚠"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{fmtDate(c.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
