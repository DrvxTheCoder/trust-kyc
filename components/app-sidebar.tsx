"use client"

import * as React from "react"
import Image from "next/image"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  IconLayoutDashboard,
  IconUsers,
  IconColumns,
  IconClock,
  IconGitBranch,
  IconUserCheck,
  IconSettings,
  IconFolder,
} from "@tabler/icons-react"

const mainNav = [
  { id: "dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { id: "customers", label: "Customers", icon: IconUsers },
  { id: "pipeline", label: "Pipeline", icon: IconColumns },
  { id: "documents", label: "Documents", icon: IconFolder },
  { id: "activity", label: "Activity Log", icon: IconClock },
]

const adminNav = [
  { id: "workflows", label: "Workflows", icon: IconGitBranch },
  { id: "team", label: "Team", icon: IconUserCheck },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentRoute?: string
  onNav?: (route: string) => void
}

export function AppSidebar({ currentRoute = "dashboard", onNav, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="md:pt-14">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer rounded-sm"
              onClick={() => onNav?.("dashboard")}
              tooltip="TrustKYC — Dashboard"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-sm overflow-hidden shrink-0">
                <Image src="/uba.png" alt="TrustKYC" width={32} height={32} className="size-8 object-contain" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">United Bank of Africa</span>
                <span className="truncate text-xs text-muted-foreground">Agence Almadies · Sénégal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentRoute === item.id}
                    tooltip={item.label}
                    onClick={() => onNav?.(item.id)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentRoute === item.id}
                    tooltip={item.label}
                    onClick={() => onNav?.(item.id)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentRoute === "settings"}
                  tooltip="Settings"
                  onClick={() => onNav?.("settings")}
                  className="cursor-pointer"
                >
                  <IconSettings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name: "Fatou Ba", email: "f.ba@cbao.sn", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
