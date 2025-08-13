import type React from "react"
import { useState } from "react"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { useAuthStore } from "@/stores/authStore"

interface MainLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    avatar?: string
  }
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<"home" | "match" | "chat" | "my" | "pingpong">("home")
  const { user: authUser } = useAuthStore()
  
  // authStore의 사용자 정보를 우선 사용
  const currentUser = authUser ? {
    name: authUser.name,
    avatar: user?.avatar
  } : user

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header user={currentUser} />

      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">{children}</main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
