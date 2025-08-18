import { useState } from "react"
import { IntuneButton } from "@/commons/components/ui/intune-button"
import { Card, CardContent } from "@/commons/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { Heart, Clock, Sparkles } from "lucide-react"

interface MatchResult {
  id: string
  nickname: string
  mbti: string
  profileImage?: string
  compatibility: number
}

interface MatchingInterfaceProps {
  onMatchFound: (match: MatchResult) => void
  onStartChat: (matchId: string) => void
  hasUsedTodayMatch?: boolean
}

export function MatchingInterface({ onMatchFound, onStartChat, hasUsedTodayMatch = false }: MatchingInterfaceProps) {
  const [isMatching, setIsMatching] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)

  const handleStartMatching = async () => {
    if (hasUsedTodayMatch) return

    setIsMatching(true)

    // Simulate matching process
    setTimeout(() => {
      const mockMatch: MatchResult = {
        id: "match_" + Date.now(),
        nickname: "서연",
        mbti: "INFJ",
        profileImage: "/friendly-woman.png",
        compatibility: 92,
      }

      setMatchResult(mockMatch)
      setIsMatching(false)
      onMatchFound(mockMatch)
    }, 3000)
  }

  const handleStartChat = () => {
    if (matchResult) {
      onStartChat(matchResult.id)
    }
  }

  if (isMatching) {
    return (
      <Card className="bg-white rounded-intune shadow-intune border-0">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-ping" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">매칭 중...</h3>
            <p className="text-sm text-subtext">당신과 잘 맞는 사람을 찾고 있어요</p>
          </div>

          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (matchResult) {
    return (
      <Card className="bg-white rounded-intune shadow-intune border-0">
        <CardContent className="p-6 text-center space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={matchResult.profileImage || "/placeholder.svg"} alt={matchResult.nickname} />
                <AvatarFallback className="text-xl font-medium bg-soft text-primary">
                  {matchResult.nickname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{matchResult.nickname}</h3>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {matchResult.mbti}
              </div>
            </div>

            <div className="bg-soft rounded-intune p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-danger" />
                <span className="text-sm font-medium">궁합도</span>
              </div>
              <div className="text-2xl font-bold text-primary">{matchResult.compatibility}%</div>
            </div>

            <p className="text-sm text-subtext leading-relaxed">
              축하해요! 당신과 잘 맞는
              <br />
              새로운 인연을 찾았습니다.
            </p>
          </div>

          <IntuneButton onClick={handleStartChat} className="w-full" size="lg">
            채팅 시작하기
          </IntuneButton>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-intune shadow-intune border-0">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">새로운 매칭 시작</h3>
          <p className="text-sm text-subtext">MBTI 기반으로 당신과 잘 맞는 사람을 찾아드려요</p>
        </div>

        {hasUsedTodayMatch ? (
          <div className="space-y-4">
            <div className="bg-soft rounded-intune p-4 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-subtext" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">오늘의 매칭 완료</p>
                <p className="text-xs text-subtext">내일 다시 매칭을 시작할 수 있어요</p>
              </div>
            </div>
            <IntuneButton disabled className="w-full" size="lg">
              내일 다시 시도
            </IntuneButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-subtext bg-soft rounded-intune p-3">하루에 한 번만 매칭할 수 있어요</div>
            <IntuneButton onClick={handleStartMatching} className="w-full" size="lg">
              매칭 시작
            </IntuneButton>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
