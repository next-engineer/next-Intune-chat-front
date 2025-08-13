import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { HamburgerMenu } from "./HamburgerMenu"
import { useAuthStore } from "@/stores/authStore"
import { Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  }
}

export function Header({ user }: HeaderProps) {
  const { user: authUser, isAdmin } = useAuthStore()
  const navigate = useNavigate()
  
  // authStore의 사용자 정보를 우선 사용
  const currentUser = authUser ? {
    name: authUser.name,
    avatar: user?.avatar
  } : user

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary">Intune</h1>
          {isAdmin && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              관리자
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>관리자</span>
                </button>
              )}
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="bg-primary text-white">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <HamburgerMenu user={currentUser} />
            </div>
          ) : (
            <HamburgerMenu />
          )}
        </div>
      </div>
    </header>
  )
}
