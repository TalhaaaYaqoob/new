'use client'

import { SidebarNav } from '@/components/sidebar-nav'
import { useSidebar } from '@/contexts/sidebar-context'
import { SidebarProvider } from '@/contexts/sidebar-context'

export default function InspoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <InspoLayoutContent>{children}</InspoLayoutContent>
    </SidebarProvider>
  )
}

function InspoLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </div>
    </div>
  )
}