"use client"

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TkBadge } from "@/components/ui/tk-badge"
import { Sparkline } from "@/components/kyc/sparkline"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { PieChart, Pie, Label, BarChart, Bar, CartesianGrid, XAxis, LabelList } from "recharts"
import { customers as allCustomers, documents as allDocuments, activity, team } from "@/lib/data"
import {
  IconUsers, IconColumns, IconCheck, IconAlertTriangle,
  IconActivity, IconPlus, IconCalendar, IconFlag,
  IconEye,
  IconExternalLink,
} from "@tabler/icons-react"

// ---- Hero KPI Card ----
function HeroKPI({
  icon: Icon,
  label,
  value,
  trend,
  spark,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  trend: string
  spark?: number[]
}) {
  return (
    <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 rounded-xl px-4 py-3 border border-white/20 flex-1 min-w-[180px]">
      <div className="size-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white font-medium">{label}</div>
        <div className="text-2xl font-bold text-white leading-none mt-0.5">{value}</div>
        <div className="text-xs text-blue-100/70 mt-0.5">{trend}</div>
      </div>
      {spark && (
        <div className="opacity-70 shrink-0">
          <Button variant={'outline'} size={'icon-lg'} className="rounded-lg border border-white/40"><IconExternalLink /></Button>
        </div>
      )}
    </div>
  )
}

// ---- Throughput bar chart ----
const throughputData = [
  { month: "Oct", accounts: 41 }, { month: "Nov", accounts: 55 }, { month: "Dec", accounts: 38 },
  { month: "Jan", accounts: 62 }, { month: "Feb", accounts: 70 }, { month: "Mar", accounts: 85 }, { month: "Apr", accounts: 48 },
]

const throughputConfig = {
  accounts: { label: "Accounts", color: "var(--chart-1)" },
} satisfies ChartConfig

function ThroughputChart() {
  return (
    <div className="h-full">
      <ChartContainer config={throughputConfig} className="h-full w-full">
        <BarChart data={throughputData} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="accounts" fill="var(--color-accounts)" radius={6}>
            <LabelList position="top" offset={10} className="fill-foreground" fontSize={11} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

// ---- Completion donut ----
const completionConfig = {
  value: { label: "Accounts" },
  approvedTime: { label: "Approved on time", color: "#10B981" },
  approvedDelayed: { label: "Approved (delayed)", color: "#F59E0B" },
  inProgress: { label: "In progress", color: "#3B82F6" },
  stuck: { label: "Stuck / escalated", color: "#EF4444" },
} satisfies ChartConfig

const completionData = [
  { key: "approvedTime", label: "Approved on time", value: 62, color: "#10B981", fill: "var(--color-approvedTime)" },
  { key: "approvedDelayed", label: "Approved (delayed)", value: 18, color: "#F59E0B", fill: "var(--color-approvedDelayed)" },
  { key: "inProgress", label: "In progress", value: 14, color: "#3B82F6", fill: "var(--color-inProgress)" },
  { key: "stuck", label: "Stuck / escalated", value: 6, color: "#EF4444", fill: "var(--color-stuck)" },
]

function CompletionPanel() {
  return (
    <div className="flex items-center justify-center h-full py-2">
      <ChartContainer config={completionConfig} className="mx-auto aspect-square max-h-[220px] w-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={completionData} dataKey="value" nameKey="label" innerRadius={68} outerRadius={98} strokeWidth={0}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">62%</tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs">on time</tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}

// ---- Alerts list ----
const alertItems = [
  { tone: "red" as const, title: "Passeport expired — Ousmane Ndiaye", sub: "Enhanced Due Diligence · 9 days stuck", time: "14m ago" },
  { tone: "red" as const, title: "NINEA expired — Awa Gueye", sub: "Stuck in Compliance Review · 8 days", time: "2h ago" },
  { tone: "amber" as const, title: "NINEA expires in 22 days — A. Fall", sub: "Business Account · Compliance", time: "6h ago" },
  { tone: "amber" as const, title: "Attestation BE expires 12d — O. Ndiaye", sub: "EDD · Beneficial Ownership", time: "1d ago" },
  { tone: "amber" as const, title: "Justificatif expires 8d — Awa Gueye", sub: "Business Account · KYC stage", time: "1d ago" },
]

function AlertsList({ onNav }: { onNav?: (r: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {alertItems.map((a, i) => (
        <div key={i} className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted/50 transition-colors">
          <div className={`mt-0.5 size-7 rounded-lg flex items-center justify-center shrink-0 ${a.tone === "red" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>
            {a.tone === "red" ? <IconAlertTriangle size={14} /> : <IconCalendar size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{a.title}</div>
            <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-full justify-center mt-1" onClick={() => onNav?.("activity")}>
        View all activity →
      </Button>
    </div>
  )
}

// ---- Top agents ----
const agentGradients = [
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#3B82F6,#8B5CF6)",
  "linear-gradient(135deg,#10B981,#3B82F6)",
  "linear-gradient(135deg,#8B5CF6,#ec4899)",
  "linear-gradient(135deg,#0D9488,#3B82F6)",
]
const agentRankColors = ["#f59e0b", "#94a3b8", "#cd7c2f"]
const agentRankEmojis = ["🥇", "🥈", "🥉"]

const topAgents = [
  { initials: "KN", name: "Khady Ndoye", role: "Compliance Officer", count: 24 },
  { initials: "AD", name: "Awa Diagne", role: "Sr. Onboarding Agent", count: 19 },
  { initials: "MK", name: "Moussa Kane", role: "Compliance Officer", count: 17 },
  { initials: "NT", name: "Ndeye Thiaw", role: "Onboarding Agent", count: 14 },
  { initials: "MS", name: "Mamadou Sy", role: "Onboarding Agent", count: 11 },
]

function TopAgents() {
  const maxCount = topAgents[0].count
  return (
    <div className="flex flex-col gap-1">
      {topAgents.map((a, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5">
          <span className="text-sm w-5 shrink-0" style={{ color: agentRankColors[i] ?? "var(--muted-foreground)" }}>
            {i < 3 ? agentRankEmojis[i] : i + 1}
          </span>
          <div className="size-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: agentGradients[i] }}>
            {a.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">{a.name}</div>
            <div className="text-[10px] text-muted-foreground">{a.role}</div>
          </div>
          <div className="flex items-center gap-2 w-20">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full opacity-80" style={{ width: `${(a.count / maxCount) * 100}%` }} />
            </div>
            <span className="text-xs font-mono font-bold w-4 text-right">{a.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- Document health ----
const docHealthTypes = [
  { label: "Carte Nationale d'Identité", valid: 28, expiring: 3, expired: 1 },
  { label: "RCCM (Registre du Commerce)", valid: 14, expiring: 2, expired: 0 },
  { label: "NINEA", valid: 11, expiring: 4, expired: 2 },
  { label: "Statuts de la Société", valid: 9, expiring: 0, expired: 0 },
  { label: "Attestation Bénéficiaires", valid: 7, expiring: 3, expired: 1 },
  { label: "Relevé Bancaire", valid: 6, expiring: 1, expired: 0 },
]

function DocHealth({ onNav }: { onNav?: (r: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {docHealthTypes.map((t, i) => {
        const total = t.valid + t.expiring + t.expired
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground w-36 truncate shrink-0">{t.label}</div>
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
              <div className="flex h-full">
                <div style={{ width: `${(t.valid / total) * 100}%`, background: "#10B981" }} />
                <div style={{ width: `${(t.expiring / total) * 100}%`, background: "#F59E0B" }} />
                <div style={{ width: `${(t.expired / total) * 100}%`, background: "#EF4444" }} />
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0">{total}</span>
          </div>
        )
      })}
      <div className="flex gap-4 mt-2">
        {[["Valid", "#10B981"], ["Expiring", "#F59E0B"], ["Expired", "#EF4444"]].map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
            <span className="size-2 rounded-sm inline-block" style={{ background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---- SLA Card ----
function SLACard() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-amber-500/5 border border-red-500/20 p-4 flex-1">
        <div className="text-4xl font-black font-mono text-red-400 leading-none">6</div>
        <div className="text-xs text-muted-foreground font-bold mt-1">days left</div>
        <div className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
          BCEAO quarterly KYC review deadline. <strong className="text-foreground">12 accounts</strong> need urgent completion.
        </div>
        <Button size="sm" className="mt-3 bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 rounded-lg text-xs font-bold" variant="ghost">
          View at-risk accounts →
        </Button>
      </div>
      <div className="rounded-xl bg-primary/8 border border-primary/20 p-3">
        <div className="text-xs font-bold text-primary mb-2">This week&apos;s target</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-blue-400" />
          </div>
          <span className="font-mono font-bold text-sm">17 / 25</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1.5">Accounts processed this week</div>
      </div>
    </div>
  )
}

// ---- Main Dashboard ----
export function Dashboard({ onNav }: { onNav?: (r: string) => void }) {
  const stuck = allCustomers.filter((c) => c.stuck).length
  const expiring = allDocuments.filter((d) => d.status === "expiring").length + 9

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-red-500 to-red-800 p-6">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.3) 0%, transparent 60%)"
        }} />
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
              <p className="text-white text-sm mt-0.5">United Bank of Africa · Agence Almadies · Friday, 25 April 2026</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 border-0" onClick={() => onNav?.("activity")}>
                <IconActivity size={14} /> Activity log
              </Button>
              {/* <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
                <IconPlus size={14} /> New customer
              </Button> */}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <HeroKPI icon={IconUsers} label="Total customers" value="1,847" trend="↑ 4.2% this month" spark={[12,14,13,15,17,16,18,20,19,22,24,26,28]} />
            <HeroKPI icon={IconColumns} label="In onboarding" value={allCustomers.filter(c => c.stage !== "approved").length + 126} trend="+12 this week" spark={[20,22,24,23,25,27,28,30,29,32,34,36,38]} />
            <HeroKPI icon={IconCheck} label="Approved this month" value="47" trend="↑ 8% vs last month" spark={[30,34,32,38,40,42,38,44,46,45,47,47,47]} />
            <HeroKPI icon={IconAlertTriangle} label="Alerts requiring action" value={stuck + expiring} trend={`${stuck} stuck · ${expiring} expiring`} spark={[6,7,8,8,9,10,11,10,12,13,14,15,16]} />
          </div>
        </div>
      </div>

      {/* Row 1: Completion | Throughput | Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Completion Rate</CardTitle>
                <CardDescription className="text-xs">SLA performance breakdown</CardDescription>
              </div>
              <TkBadge tone="green" dot>Healthy</TkBadge>
            </div>
          </CardHeader>
          <CardContent className="flex-1"><CompletionPanel /></CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {completionData.map((b) => (
                <div key={b.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full shrink-0" style={{ background: b.color }} />
                  {b.label}
                </div>
              ))}
            </div>
            <div className="w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span>↑</span>
              <span><strong>+4.1%</strong> completion rate vs last month</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Monthly Throughput</CardTitle>
                <CardDescription className="text-xs">Accounts fully onboarded</CardDescription>
              </div>
              <span className="text-2xl font-bold border px-4 rounded-lg text-muted-foreground">399</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1"><ThroughputChart /></CardContent>
          <CardFooter className="flex items-center justify-end pt-0">
            <div className="w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span>↑</span>
              <span><strong>+16.8%</strong> avg growth</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Alerts Requiring Action</CardTitle>
                <CardDescription className="text-xs">Documents & stuck accounts</CardDescription>
              </div>
              <TkBadge tone="red" dot>8 open</TkBadge>
            </div>
          </CardHeader>
          <CardContent><AlertsList onNav={onNav} /></CardContent>
        </Card>
      </div>

      {/* Row 2: SLA | Top agents | Doc health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">BCEAO Deadline</CardTitle>
            <CardDescription className="text-xs">Quarterly compliance review</CardDescription>
          </CardHeader>
          <CardContent className="flex-1"><SLACard /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Top Agents</CardTitle>
                <CardDescription className="text-xs">Accounts processed · April</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent><TopAgents /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm">Document Health</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onNav?.("documents")}>
                View all →
              </Button>
            </div>
            <CardDescription className="text-xs">By document type</CardDescription>
          </CardHeader>
          <CardContent><DocHealth onNav={onNav} /></CardContent>
        </Card>
      </div>
    </div>
  )
}
