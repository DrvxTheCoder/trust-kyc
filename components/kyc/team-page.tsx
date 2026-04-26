"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TkBadge } from "@/components/ui/tk-badge"
import { team, TeamMember } from "@/lib/data"
import { IconPlus, IconUpload, IconChevronRight, IconSelector } from "@tabler/icons-react"

function UserDetail({ user }: { user: TeamMember }) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-base shrink-0">
            {user.initials}
          </div>
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role category</label>
            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
              <span>{user.category}</span>
              <IconSelector size={14} className="text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role</label>
            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
              <span>{user.role}</span>
              <IconSelector size={14} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Digital signature</label>
          <div className={`rounded-lg border-2 border-dashed p-4 text-center ${user.hasSig ? "border-border" : "border-border/50"}`}>
            {user.hasSig ? (
              <>
                <div className="text-3xl text-foreground italic mb-1" style={{ fontFamily: "Georgia, serif" }}>
                  {user.name.split(" ").map((n) => n[0]).join("")}. {user.name.split(" ").slice(-1)[0]}
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">Uploaded 12 Feb 2026</div>
                <Button variant="ghost" size="sm" className="h-7 text-xs"><IconUpload size={12} className="mr-1" />Replace</Button>
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-2">No signature on file</div>
                <Button variant="outline" size="sm" className="h-7 text-xs"><IconUpload size={12} className="mr-1" />Upload signature</Button>
              </>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
            Signature required for roles with stage-approval permissions. Applied to completion reports at the Account Approved stage.
          </p>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1 text-xs">Deactivate</Button>
          <Button size="sm" className="flex-1 text-xs">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RolesPanel() {
  const categories = [
    {
      name: "Operational", tone: "blue" as const,
      roles: [
        { name: "Onboarding Agent", perms: 8 },
        { name: "Senior Onboarding Agent", perms: 12 },
        { name: "Front-Desk Associate", perms: 5 },
      ]
    },
    {
      name: "Compliance & Audit", tone: "violet" as const,
      roles: [
        { name: "Compliance Officer", perms: 14 },
        { name: "Senior Compliance Officer", perms: 18 },
        { name: "Internal Auditor", perms: 9 },
      ]
    },
    {
      name: "Supervisory", tone: "green" as const,
      roles: [
        { name: "Team Lead", perms: 16 },
        { name: "Administrator", perms: 24 },
        { name: "Branch Manager", perms: 20 },
      ]
    }
  ]
  const [open, setOpen] = useState("Compliance Officer")
  const perms = [
    ["Upload documents", true], ["Delete documents", false],
    ["Advance stages (forward)", true], ["Move stages backward", true],
    ["Approve accounts", true], ["Reject accounts", true],
    ["Flag for review", true], ["Override document expiry", false],
    ["View all customers", true], ["Edit customer data", true],
    ["Generate compliance reports", true], ["Access activity log", true],
    ["Manage users", false], ["Configure workflows", false],
  ] as [string, boolean][]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <Card key={cat.name}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{cat.name}</CardTitle>
              <TkBadge tone={cat.tone}>{cat.roles.length}</TkBadge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {cat.roles.map((r) => (
              <div key={r.name}>
                <div
                  onClick={() => setOpen(open === r.name ? "" : r.name)}
                  className={`flex items-center justify-between rounded-lg border p-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${open === r.name ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.perms} permissions</div>
                  </div>
                  <IconChevronRight size={14} className={`text-muted-foreground transition-transform ${open === r.name ? "rotate-90" : ""}`} />
                </div>
                {open === r.name && (
                  <div className="mt-1.5 border rounded-lg p-3 bg-muted/30 flex flex-col gap-1">
                    {perms.slice(0, Math.min(r.perms, perms.length)).map(([p, on], i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`size-3.5 rounded flex items-center justify-center shrink-0 border ${on ? "bg-primary border-primary" : "bg-transparent border-border"}`}>
                          {on && <span className="text-[8px] text-white font-bold">✓</span>}
                        </span>
                        <span className={on ? "text-foreground" : "text-muted-foreground"}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="justify-center text-xs mt-1">
              <IconPlus size={13} className="mr-1" />Create role
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TeamPage() {
  const [selected, setSelected] = useState<TeamMember>(team[0])
  const [tab, setTab] = useState<"users" | "roles">("users")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Team & Roles</h1>
          <p className="text-sm text-muted-foreground">Manage users, roles, permissions, and signature uploads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Invite via email</Button>
          <Button size="sm"><IconPlus size={14} className="mr-1" />Add user</Button>
        </div>
      </div>

      <div className="flex rounded-lg border overflow-hidden w-fit">
        {(["users", "roles"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-semibold transition-colors capitalize ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
          >
            {t === "roles" ? "Roles & permissions" : "Users"}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">User</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Role</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Category</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Last active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((u) => (
                      <tr
                        key={u.email}
                        onClick={() => setSelected(u)}
                        className={`border-b last:border-0 cursor-pointer transition-colors ${selected?.email === u.email ? "bg-primary/5" : "hover:bg-muted/40"}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">{u.role}</td>
                        <td className="px-4 py-3">
                          <TkBadge tone={u.category === "Operational" ? "blue" : u.category === "Compliance & Audit" ? "violet" : "green"}>
                            {u.category}
                          </TkBadge>
                        </td>
                        <td className="px-4 py-3">
                          <TkBadge tone={u.status === "Active" ? "green" : "slate"} dot>{u.status}</TkBadge>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {selected && <UserDetail user={selected} />}
        </div>
      ) : (
        <RolesPanel />
      )}
    </div>
  )
}
