import type React from "react"
import { useState } from "react"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"

interface MainLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    avatar?: string
  }
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<"home" | "match" | "chat" | "my">("home")

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">{children}</main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
