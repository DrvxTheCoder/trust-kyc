"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TkBadge, TypeBadge, RiskBadge, StatusBadge } from "@/components/ui/tk-badge"
import { Stepper } from "@/components/kyc/stepper"
import { Customer, Document, ActivityItem, fmtDate, relTime, getWorkflowForCustomer, activity as allActivity, documents as allDocuments } from "@/lib/data"
import {
  IconArrowLeft, IconUpload, IconFlag, IconArrowRight,
  IconEye, IconAlertTriangle, IconCheck, IconX, IconActivity,
  IconUser, IconChevronLeft,
} from "@tabler/icons-react"

function InfoRow({ label, value, mono }: { label: string; value: string | undefined; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value ?? "—"}</div>
    </div>
  )
}

function iconForAction(action: string) {
  if (action.includes("Upload")) return <IconUpload size={14} />
  if (action.includes("Transition")) return <IconArrowRight size={14} />
  if (action.includes("Approv")) return <IconCheck size={14} />
  if (action.includes("Reject")) return <IconX size={14} />
  if (action.includes("Flag")) return <IconFlag size={14} />
  if (action.includes("Alert")) return <IconAlertTriangle size={14} />
  return <IconActivity size={14} />
}

function FeedItem({ action, user, role, detail, time }: { action: string; user: string; role: string; detail: string; time: string }) {
  return (
    <div className="flex gap-3 py-2.5 border-b last:border-0">
      <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
        {iconForAction(action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold">{user}</span>
          <span className="text-xs text-muted-foreground">· {role}</span>
          <span className="text-xs text-muted-foreground ml-auto shrink-0">{time}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{detail}</div>
      </div>
    </div>
  )
}

export function CustomerProfile({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const wf = getWorkflowForCustomer(customer.type)
  const stages = wf.stages
  const currentIdx = stages.findIndex((s) => s.id === customer.stage)
  const docs = allDocuments.filter((d) => d.customerId === customer.id)
  const feed = allActivity.filter((a) => a.customer === customer.name)
  const missingCount = customer.docsTotal - customer.docs

  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 -ml-2">
          <IconChevronLeft size={16} /> Back to pipeline
        </Button>
      </div>

      {/* Profile hero */}
      <div className="flex items-start gap-4 rounded-2xl border bg-card p-5">
        <div className="size-14 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
          {customer.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold">{customer.name}</h1>
              <div className="text-sm text-muted-foreground font-mono">{customer.id} · Created {fmtDate(customer.created)}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm"><IconUpload size={14} className="mr-1" />Upload document</Button>
              <Button variant="outline" size="sm"><IconFlag size={14} className="mr-1" />Flag for review</Button>
              <Button size="sm"><IconArrowRight size={14} className="mr-1" />Advance stage</Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            <TypeBadge type={customer.type} />
            <RiskBadge risk={customer.risk} />
            <TkBadge tone="blue" dot>In {stages[currentIdx]?.name}</TkBadge>
            <TkBadge tone="slate">{customer.daysInStage}d in stage</TkBadge>
            {customer.stuck && <TkBadge tone="red" dot>Stuck — needs attention</TkBadge>}
            <TkBadge tone="outline">{customer.docs}/{customer.docsTotal} docs</TkBadge>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Left col */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Customer information</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoRow label="First name" value={customer.name.split(" ")[0]} />
                <InfoRow label="Last name" value={customer.name.split(" ").slice(1).join(" ")} />
                <InfoRow label="Date of birth" value={fmtDate(customer.dob)} />
                <InfoRow label="Nationality" value={customer.nationality} />
                <InfoRow label="Phone" value={customer.phone} mono />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Address" value={customer.address} />
                <InfoRow label="Account type" value={customer.type === "Business" ? "Business Account (SARL)" : customer.type === "EDD" ? "Enhanced Due Diligence" : "Basic Individual"} />
                {customer.company && <InfoRow label="Legal entity" value={customer.company} />}
                <InfoRow label="Created at" value={fmtDate(customer.created)} mono />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Document archive</CardTitle>
                  <CardDescription className="text-xs">{docs.length} uploaded · {missingCount} missing</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs"><IconUpload size={13} className="mr-1" />Upload</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {missingCount > 0 && (
                <div className="mx-4 mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex gap-2">
                  <IconAlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span><strong>{missingCount} required document{missingCount > 1 ? "s" : ""} missing</strong> — required before the next stage transition.</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Document</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Uploaded</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Expires</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">By</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id} className="border-b last:border-0">
                        <td className="px-4 py-2.5">
                          <div className="font-semibold text-xs">{d.type}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{d.id}</div>
                        </td>
                        <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{fmtDate(d.uploaded)}</td>
                        <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{fmtDate(d.expires)}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{d.by}</td>
                        <td className="px-4 py-2.5">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><IconEye size={13} /></Button>
                        </td>
                      </tr>
                    ))}
                    {docs.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">No documents uploaded yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Workflow progress</CardTitle>
                  <CardDescription className="text-xs">{wf.name} · {currentIdx + 1} of {stages.length}</CardDescription>
                </div>
                <TkBadge tone="blue">{Math.round((currentIdx / (stages.length - 1)) * 100)}%</TkBadge>
              </div>
            </CardHeader>
            <CardContent>
              <Stepper stages={stages} currentStageId={customer.stage} daysInStage={customer.daysInStage} created={customer.created} />
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">← Move back</Button>
                <Button size="sm">
                  <IconArrowRight size={14} className="mr-1" />
                  Advance to {stages[currentIdx + 1]?.short ?? "Complete"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Activity timeline</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Full log</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 px-4">
              {feed.length === 0 ? (
                <>
                  <FeedItem action="Document Upload" user="Khady Ndoye" role="Compliance Officer" detail={`Uploaded ${docs[0]?.type ?? "document"}`} time="2h ago" />
                  <FeedItem action="Stage Transition" user="Awa Diagne" role="Senior Onboarding Agent" detail={`Moved from ${stages[Math.max(0, currentIdx - 1)]?.name ?? "—"} → ${stages[currentIdx]?.name}`} time="Yesterday" />
                  <FeedItem action="Approval" user="Ibrahima Cissé" role="Team Lead" detail="Approved business documents" time="2d ago" />
                  <FeedItem action="User" user="System" role="Automation" detail={`Account created · Assigned ${wf.name} workflow`} time={fmtDate(customer.created)} />
                </>
              ) : (
                feed.map((a, i) => (
                  <FeedItem key={i} action={a.action} user={a.user} role={a.role} detail={a.detail} time={relTime(a.t)} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
