"use client"

import * as React from "react"
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
  UserIcon,
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
  const [open, setOpen] = React.useState(false)

  const isProfile = currentRoute === "profile" && customerName

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
              <CommandItem onSelect={() => { onNav?.("dashboard"); setOpen(false) }}>
                <HomeIcon />
                <span>Dashboard</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("customers"); setOpen(false) }}>
                <UsersIcon />
                <span>Customers</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("documents"); setOpen(false) }}>
                <FileTextIcon />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("pipeline"); setOpen(false) }}>
                <FolderIcon />
                <span>Pipeline</span>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("activity"); setOpen(false) }}>
                <InboxIcon />
                <span>Activity Log</span>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("workflows"); setOpen(false) }}>
                <WorkflowIcon />
                <span>Workflows</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem onSelect={() => { onNav?.("profile"); setOpen(false) }}>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("settings"); setOpen(false) }}>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { onNav?.("team"); setOpen(false) }}>
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
