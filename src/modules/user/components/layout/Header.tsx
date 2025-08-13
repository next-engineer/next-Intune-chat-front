import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HamburgerMenu } from "./HamburgerMenu"
import { useAuthStore } from "@/stores/authStore"

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  }
}

export function Header({ user }: HeaderProps) {
  const { user: authUser, isAdmin } = useAuthStore()
  
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
