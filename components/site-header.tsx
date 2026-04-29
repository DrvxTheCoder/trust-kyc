"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  BellIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { TrustKYCLogoFull } from "./icons/trustkyc-logo-full"
import { ModeToggle } from "@/components/theme-toggle"
import { useCustomerStore } from "@/lib/store"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  pipeline: "Pipeline",
  documents: "Documents",
  activity: "Activity Log",
  workflows: "Workflows",
  team: "Team",
  settings: "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const [open, setOpen] = React.useState(false)

  const segments = pathname.split("/").filter(Boolean)
  const section = segments[1] ?? "dashboard"
  const customerId = segments[1] === "customers" && segments[2] ? segments[2] : null

  const customer = useCustomerStore((s) =>
    customerId ? s.customers.find((c) => c.id === customerId) : undefined
  )

  const isProfile = !!customerId && !!customer

  const nav = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 sm:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <div className="hidden px-1 sm:block" onClick={toggleSidebar} style={{ cursor: "pointer" }}>
          <TrustKYCLogoFull size={23} className="text-foreground" />
        </div>
        <Separator
          orientation="vertical"
          className="me-2 hidden data-vertical:h-4 data-vertical:self-auto sm:block"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {isProfile ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/customers">Customers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{customer!.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">TrustKYC</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{routeLabels[section] ?? section}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="ms-auto flex h-8 min-w-0 max-w-xs flex-1 items-center justify-between gap-2 rounded-md px-3 text-sm text-muted-foreground sm:w-64 sm:flex-none"
        >
          <span className="flex items-center gap-2">
            <SearchIcon className="h-3.5 w-3.5" />
            Search...
          </span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => nav("/dashboard")}>
                  <HomeIcon />
                  <span>Dashboard</span>
                  <CommandShortcut>⌘H</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/customers")}>
                  <UsersIcon />
                  <span>Customers</span>
                  <CommandShortcut>⌘C</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/documents")}>
                  <FileTextIcon />
                  <span>Documents</span>
                  <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/pipeline")}>
                  <FolderIcon />
                  <span>Pipeline</span>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/activity")}>
                  <InboxIcon />
                  <span>Activity Log</span>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/workflows")}>
                  <WorkflowIcon />
                  <span>Workflows</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Account">
                <CommandItem onSelect={() => nav("/dashboard/settings")}>
                  <SettingsIcon />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => nav("/dashboard/team")}>
                  <UsersIcon />
                  <span>Team</span>
                </CommandItem>
                <CommandItem>
                  <CreditCardIcon />
                  <span>Billing</span>
                </CommandItem>
                <CommandItem>
                  <BellIcon />
                  <span>Notifications</span>
                </CommandItem>
                <CommandItem>
                  <HelpCircleIcon />
                  <span>Help & Support</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>

        <div className="shrink-0">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
