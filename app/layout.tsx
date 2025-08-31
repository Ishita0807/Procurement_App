'use client'
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import {
  Leaf,
  BarChart3,
  Upload,
  Settings,
  FileSpreadsheet,
  Award,
  TrendingUp
} from 'lucide-react'
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
  SidebarTrigger
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CustomUserMenu from '@/components/customUsercard'
import './globals.css'
import { UserProvider } from '@/providers/usercontext'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3
  },
  {
    title: 'Upload Data',
    url: '/upload',
    icon: Upload
  },
  {
    title: 'Rankings',
    url: '/rankings',
    icon: Award
  },
  {
    title: 'Weight Settings',
    url: '/settings',
    icon: Settings
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // find the current page based on the URL
  const currentPage = navigationItems.find((item) => item.url === pathname)

  return (
    
      <html lang="en">
        <body>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
              <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-sm">
                <SidebarHeader className="border-b border-slate-200/60 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        EcoRank
                      </h2>
                      <p className="text-xs font-medium text-slate-500">
                        Sustainable Supplier Selection
                      </p>
                    </div>
                  </div>
                </SidebarHeader>

                <SidebarContent className="p-3">
                  <SidebarGroup>
                    <SidebarGroupLabel className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {navigationItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className={`h-11 rounded-xl transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 ${
                                pathname === item.url
                                  ? 'border border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-sm'
                                  : 'text-slate-600'
                              }`}
                            >
                              <Link
                                href={item.url}
                                className="flex items-center gap-3 px-3 py-2.5"
                              >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">
                                  {item.title}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                        <SignedOut>
                          <SignInButton>
                            <button className="h-11 rounded-xl border border-emerald-200/60 font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 ">
                              Sign In
                            </button>
                          </SignInButton>
                          <SignUpButton>
                            <button className="h-11 rounded-xl border border-emerald-200/60 bg-emerald-50 font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 ">
                              Sign Up
                            </button>
                          </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                          <CustomUserMenu />
                        </SignedIn>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  {/* Quick Insights section unchanged */}
                </SidebarContent>

                <SidebarFooter className="border-t border-slate-200/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-300">
                      <span className="text-sm font-semibold text-slate-600">
                        PM
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        Procurement Manager
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Sustainable sourcing expert
                      </p>
                    </div>
                  </div>
                </SidebarFooter>
              </Sidebar>

              <main className="flex min-w-0 flex-1 flex-col">
                {/* Mobile Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur-sm md:hidden">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="rounded-lg p-2 transition-colors duration-200 hover:bg-slate-100" />
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                      <h1 className="text-lg font-bold text-slate-900">
                        {currentPage?.title ?? 'EcoRank'}
                      </h1>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-auto">
                  <UserProvider>
                    {children}
                  </UserProvider>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </body>
      </html>
    
  )
}