"use client"

import { useState, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/kyc/dashboard"
import { PipelinePage } from "@/components/kyc/pipeline"
import { CustomerProfile } from "@/components/kyc/customer-profile"
import { CustomersList } from "@/components/kyc/customers-list"
import { DocumentsPage } from "@/components/kyc/documents-page"
import { ActivityLog } from "@/components/kyc/activity-log"
import { WorkflowsPage } from "@/components/kyc/workflows-page"
import { TeamPage } from "@/components/kyc/team-page"
import { Customer, customers as initialCustomers } from "@/lib/data"

type Route = "dashboard" | "customers" | "pipeline" | "documents" | "activity" | "workflows" | "team" | "settings" | "profile"

export default function DashboardPage() {
  const [route, setRoute] = useState<Route>("dashboard")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerState, setCustomerState] = useState<Customer[]>(initialCustomers)

  const openCustomer = useCallback((c: Customer) => {
    setSelectedCustomer(c)
    setRoute("profile")
  }, [])

  const openCustomerById = useCallback((id: string) => {
    const c = customerState.find((x) => x.id === id)
    if (c) openCustomer(c)
  }, [customerState, openCustomer])

  const nav = useCallback((r: string) => {
    setSelectedCustomer(null)
    setRoute(r as Route)
  }, [])

  const moveCustomer = useCallback((customerId: string, stageId: string) => {
    setCustomerState((prev) =>
      prev.map((c) => c.id === customerId ? { ...c, stage: stageId, daysInStage: 0, stuck: false } : c)
    )
  }, [])

  let content: React.ReactNode

  if (route === "profile" && selectedCustomer) {
    content = <CustomerProfile customer={selectedCustomer} onBack={() => nav("pipeline")} />
  } else if (route === "dashboard") {
    content = <Dashboard onNav={nav} />
  } else if (route === "pipeline") {
    content = <PipelinePage customers={customerState} onOpen={openCustomer} onMove={moveCustomer} />
  } else if (route === "customers") {
    content = <CustomersList customers={customerState} onOpen={openCustomer} />
  } else if (route === "documents") {
    content = <DocumentsPage onOpenCustomer={openCustomerById} />
  } else if (route === "activity") {
    content = <ActivityLog />
  } else if (route === "workflows") {
    content = <WorkflowsPage />
  } else if (route === "team") {
    content = <TeamPage />
  } else {
    content = (
      <div className="flex items-center justify-center min-h-75">
        <div className="text-sm text-muted-foreground capitalize">{route} — coming soon.</div>
      </div>
    )
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader
          currentRoute={route}
          customerName={selectedCustomer?.name}
          onNav={nav}
        />
        <div className="flex flex-1">
          <AppSidebar currentRoute={route} onNav={nav} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-5">
              {content}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
