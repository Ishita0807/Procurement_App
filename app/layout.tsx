'use client';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import React from "react";
import { 
  Leaf, 
  BarChart3, 
  Upload, 
  Settings, 
  FileSpreadsheet,
  Award,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const navigationItems = [
  {
    title: "Dashboard",
    url: '/',
    icon: BarChart3,
  },
  {
    title: "Upload Data",
    url: '/upload',
    icon: Upload,
  },
  {
    title: "Rankings",
    url: '/rankings',
    icon: Award,
  },
  {
    title: "Weight Settings",
    url: '/settings',
    icon: Settings,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // find the current page based on the URL
  const currentPage = navigationItems.find(item => item.url === pathname);

  return (
    <ClerkProvider >
      <html lang="en">
        <body>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
              <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-sm">
              <SidebarHeader className="border-b border-slate-200/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">EcoRank</h2>
                    <p className="text-xs text-slate-500 font-medium">Sustainable Supplier Selection</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-3">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                    Navigation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-xl h-11 ${
                              pathname === item.url 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm font-medium' 
                                : 'text-slate-600'
                            }`}
                          >
                            <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu><div ><SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn></div>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Insights section unchanged */}
              </SidebarContent>

              <SidebarFooter className="border-t border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                    <span className="text-slate-600 font-semibold text-sm">PM</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">Procurement Manager</p>
                    <p className="text-xs text-slate-500 truncate">Sustainable sourcing expert</p>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0">
              {/* Mobile Header */}
              <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <h1 className="text-lg font-bold text-slate-900">
                      {currentPage?.title ?? "EcoRank"}
                    </h1>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
