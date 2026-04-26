"use client"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { TrustKYCLogo } from "@/components/icons/trustkyc-logo"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  pipeline: "Pipeline",
  documents: "Documents",
  activity: "Activity Log",
  workflows: "Workflows",
  team: "Team",
  settings: "Settings",
  profile: "Customer Profile",
}

interface SiteHeaderProps {
  currentRoute?: string
  customerName?: string
  onNav?: (route: string) => void
}

export function SiteHeader({ currentRoute = "dashboard", customerName, onNav }: SiteHeaderProps) {
  const { toggleSidebar } = useSidebar()

  const isProfile = currentRoute === "profile" && customerName

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
        <div className="px-1"
          onClick={toggleSidebar}
        >
          <TrustKYCLogo size={25} className="text-foreground" />
        </div>
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {isProfile ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNav?.("customers") }}
                  >
                    Customers
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{customerName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNav?.("dashboard") }}
                  >
                    TrustKYC
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{routeLabels[currentRoute] ?? currentRoute}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ms-auto sm:w-auto" />
      </div>
    </header>
  )
}
