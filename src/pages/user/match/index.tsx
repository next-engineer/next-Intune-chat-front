import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { MatchingInterface } from "@/components/matching/MatchingInterface"
import { MatchHistory } from "@/components/matching/MatchHistory"

// Mock data
const mockMatchHistory = [
  {
    id: "1",
    nickname: "지민",
    mbti: "ENFP",
    profileImage: "/diverse-group.png",
    matchedAt: "2024-01-15",
    status: "active" as const,
    lastMessage: "안녕하세요! 반가워요 😊",
  },
  {
    id: "2",
    nickname: "현우",
    mbti: "ISTJ",
    profileImage: "/thoughtful-man.png",
    matchedAt: "2024-01-14",
    status: "ended" as const,
  },
  {
    id: "3",
    nickname: "수진",
    mbti: "INFP",
    profileImage: "/diverse-woman-portrait.png",
    matchedAt: "2024-01-13",
    status: "active" as const,
    lastMessage: "오늘 날씨가 정말 좋네요!",
  },
]

export default function MatchingPage() {
  const navigate = useNavigate()
  const [hasUsedTodayMatch, setHasUsedTodayMatch] = useState(false)
  const [matchHistory, setMatchHistory] = useState(mockMatchHistory)

  const handleMatchFound = (match: any) => {
    // TODO: Implement INTUNE-API-05 - Save match result
    console.log("Match found:", match)
    setHasUsedTodayMatch(true)

    // Add to history
    const newMatch = {
      id: match.id,
      nickname: match.nickname,
      mbti: match.mbti,
      profileImage: match.profileImage,
      matchedAt: new Date().toISOString().split("T")[0],
      status: "active" as const,
    }
    setMatchHistory((prev) => [newMatch, ...prev])
  }

  const handleStartChat = (matchId: string) => {
    // TODO: Navigate to chat with specific match
    console.log("Starting chat with match:", matchId)
    navigate(`/chat/${matchId}`)
  }

  const handleSelectMatch = (matchId: string) => {
    navigate(`/chat/${matchId}`)
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">매칭</h1>
          <p className="text-subtext">MBTI 기반으로 당신과 잘 맞는 사람을 찾아보세요</p>
        </div>

        <MatchingInterface
          onMatchFound={handleMatchFound}
          onStartChat={handleStartChat}
          hasUsedTodayMatch={hasUsedTodayMatch}
        />

        <MatchHistory matches={matchHistory} onSelectMatch={handleSelectMatch} />
      </div>
    </MainLayout>
  )
} 