'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Newspaper, FolderHeart, Box, Calendar, Home, PenSquare, Settings, HelpCircle, LogOut, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from '@/contexts/sidebar-context'

const navItems = [
  { icon: Zap, label: 'Viral Mode', href: '/inspo' },
  // { icon: Newspaper, label: 'Industry News', href: '/news' },
  { icon: FolderHeart, label: 'Collections', href: '/collections' },
  { icon: Box, label: 'Assets', href: '/assets' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
]

export function SidebarNav() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <nav className={cn(
      "bg-white border-r border-gray-200 h-screen fixed left-0 top-0 p-4 flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="h-12 mb-8 flex justify-between items-center">
        {!isCollapsed && (
          <div className="w-32">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Scrybe
            </h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Link
        href="/write"
        className={cn(
          "flex items-center px-4 py-3 mb-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors",
          isCollapsed && "justify-center px-2"
        )}
      >
        <PenSquare className="h-5 w-5" />
        {!isCollapsed && <span className="font-medium ml-3">Write</span>}
      </Link>

      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg group",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
            {!isCollapsed && <span className="font-medium ml-3 group-hover:text-emerald-600">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="space-y-1 pt-4 border-t">
        <Link
          href="/settings"
          className={cn(
            "flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
          {!isCollapsed && <span className="font-medium ml-3 group-hover:text-emerald-600">Settings</span>}
        </Link>
        <Link
          href="/help"
          className={cn(
            "flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <HelpCircle className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
          {!isCollapsed && <span className="font-medium ml-3 group-hover:text-emerald-600">Help Center</span>}
        </Link>
        <button
          className={cn(
            "w-full flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
          {!isCollapsed && <span className="font-medium ml-3 group-hover:text-emerald-600">Logout</span>}
        </button>

        <div className={cn(
          "flex items-center px-4 py-3 mt-4",
          isCollapsed && "justify-center px-2"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
                <p className="text-xs text-gray-500 truncate">user@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

