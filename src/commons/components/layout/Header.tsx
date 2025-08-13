import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { Button } from "@/commons/components/ui/button"
import { Menu } from "lucide-react"

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary">Intune</h1>
        </div>

        <div className="flex items-center space-x-2">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
