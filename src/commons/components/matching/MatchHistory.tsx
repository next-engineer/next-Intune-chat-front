import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/commons/components/ui/card"
import { Badge } from "@/commons/components/ui/badge"
import { MessageCircle, Calendar } from "lucide-react"

interface MatchHistoryItem {
  id: string
  nickname: string
  mbti: string
  profileImage?: string
  matchedAt: string
  status: "active" | "ended" | "blocked"
  lastMessage?: string
}

interface MatchHistoryProps {
  matches: MatchHistoryItem[]
  onSelectMatch: (matchId: string) => void
}

export function MatchHistory({ matches, onSelectMatch }: MatchHistoryProps) {
  const getStatusBadge = (status: MatchHistoryItem["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-white">진행중</Badge>
      case "ended":
        return <Badge variant="secondary">종료</Badge>
      case "blocked":
        return <Badge variant="destructive">차단됨</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "오늘"
    if (diffDays === 2) return "어제"
    if (diffDays <= 7) return `${diffDays - 1}일 전`
    return date.toLocaleDateString("ko-KR")
  }

  if (matches.length === 0) {
    return (
      <Card className="bg-soft rounded-intune border-0">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">아직 매칭 기록이 없어요</h3>
            <p className="text-sm text-subtext">첫 매칭을 시작해보세요!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-intune shadow-intune border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">매칭 기록</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => match.status === "active" && onSelectMatch(match.id)}
            className={`p-4 rounded-intune border transition-colors ${
              match.status === "active"
                ? "border-gray-200 hover:border-primary cursor-pointer hover:bg-primary/5"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={match.profileImage || "/placeholder.svg"} alt={match.nickname} />
                <AvatarFallback className="bg-soft text-primary font-medium">{match.nickname.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{match.nickname}</h4>
                  <span className="text-xs text-primary font-medium">{match.mbti}</span>
                  {getStatusBadge(match.status)}
                </div>

                <div className="flex items-center space-x-2 text-xs text-subtext">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(match.matchedAt)}</span>
                </div>

                {match.lastMessage && match.status === "active" && (
                  <p className="text-sm text-subtext mt-1 truncate">{match.lastMessage}</p>
                )}
              </div>

              {match.status === "active" && <MessageCircle className="w-4 h-4 text-primary" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
