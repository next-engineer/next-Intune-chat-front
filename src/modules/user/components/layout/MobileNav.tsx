import { Home, Heart, MessageCircle, User, Users } from "lucide-react"
import { cn } from "@/utils"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

interface MobileNavProps {
  activeTab?: "home" | "match" | "chat" | "my" | "pingpong"
  onTabChange?: (tab: "home" | "match" | "chat" | "my" | "pingpong") => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuthStore()

  // Determine active tab based on current path
  const getCurrentTab = () => {
    if (location.pathname === "/") return "home"
    if (location.pathname.startsWith("/matching")) return "match"
    if (location.pathname.startsWith("/chat")) return "chat"
    if (location.pathname.startsWith("/my")) return "my"
    if (location.pathname.startsWith("/pingpong")) return "pingpong"
    return activeTab || "home"
  }

  const currentTab = getCurrentTab()

  const baseTabs = [
    { id: "home" as const, label: "홈", icon: Home, path: "/" },
    { id: "match" as const, label: "매칭", icon: Heart, path: "/matching" },
    { id: "chat" as const, label: "채팅", icon: MessageCircle, path: "/chat" },
    { id: "my" as const, label: "마이페이지", icon: User, path: "/my" },
  ]

  // 관리자만 핑퐁 테스트 탭 추가
  const adminTabs = [
    { id: "pingpong" as const, label: "핑퐁", icon: Users, path: "/pingpong" },
  ]

  const tabs = isAdmin ? [...baseTabs, ...adminTabs] : baseTabs

  const handleTabClick = (tab: (typeof tabs)[0]) => {
    onTabChange?.(tab.id)
    navigate(tab.path)
  }

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <button
            key={id}
            onClick={() => handleTabClick({ id, label, icon: Icon, path })}
            className={cn(
              "flex flex-col items-center justify-center min-h-touch px-3 py-2 text-xs transition-colors",
              currentTab === id ? "text-primary" : "text-subtext hover:text-gray-900",
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
