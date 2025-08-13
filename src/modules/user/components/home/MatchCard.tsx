import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IntuneButton } from "@/components/ui/intune-button"
import { Card, CardContent } from "@/components/ui/card"

interface MatchCardProps {
  user: {
    id: string
    nickname: string
    mbti: string
    profileImage?: string
  }
  onStartChat: () => void
}

export function MatchCard({ user, onStartChat }: MatchCardProps) {
  return (
    <Card className="bg-white rounded-intune shadow-intune border-0">
      <CardContent className="p-6 text-center space-y-4">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage
            src={user.profileImage || "/placeholder.svg?height=80&width=80&query=profile"}
            alt={user.nickname}
          />
          <AvatarFallback className="text-lg font-medium bg-soft text-primary">
            {user.nickname.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{user.nickname}</h3>
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {user.mbti}
          </div>
        </div>

        <p className="text-sm text-subtext leading-relaxed">
          당신과 MBTI 궁합이 가장 잘 맞는
          <br />
          오늘의 인연입니다.
        </p>

        <IntuneButton onClick={onStartChat} className="w-full">
          채팅 시작
        </IntuneButton>
      </CardContent>
    </Card>
  )
}
