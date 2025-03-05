"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, Home, Trash2, Settings, AlertTriangle, FileText, 
  LogOut, Moon, Sun 
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, 
  SidebarMenuItem, SidebarRail
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // Track if component has mounted

  useEffect(() => {
    setMounted(true); // Ensure this runs only on the client
  }, []);

  const mainNavItems = [
    { title: "Dashboard", href: "/", icon: Home },
    { title: "Waste Management", href: "/waste", icon: Trash2 },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Add Inventory", href: "/add-inventory", icon: BarChart3 },
    { title: "Modify Inventory", href: "/modify-inventory", icon: BarChart3 },
    { title: "Inventory", href: "/inventory", icon: BarChart3 },
    { title: "Products Chart", href: "/products", icon: BarChart3 },
  ];

  const utilityNavItems = [
    { title: "Reports", href: "/reports", icon: FileText },
    { title: "Alerts", href: "/alerts", icon: AlertTriangle },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">WasteTrack</span>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          {mounted && ( // Wait for hydration before rendering
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}