import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/commons/components/layout/MainLayout"
import { MatchCard } from "@/commons/components/home/MatchCard"
import { EmptyMatch } from "@/commons/components/home/EmptyMatch"

// Mock data - replace with actual API call
const mockTodayMatch = {
  id: "1",
  nickname: "민지",
  mbti: "ENFP",
  profileImage: "/friendly-woman.png",
}

export default function HomePage() {
  const navigate = useNavigate()
  const [hasMatch, setHasMatch] = useState(false)
  const [todayMatch, setTodayMatch] = useState(mockTodayMatch)

  const handleStartMatching = () => {
    // Navigate to matching page instead of inline matching
    navigate("/matching")
  }

  const handleStartChat = () => {
    // TODO: Navigate to chat with matched user
    console.log("Starting chat with:", todayMatch.id)
    navigate(`/chat/${todayMatch.id}`)
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">오늘의 매칭</h1>
          <p className="text-subtext">결이 닮은 사람과, 마음이 닿는 매칭</p>
        </div>

        {hasMatch ? (
          <MatchCard user={todayMatch} onStartChat={handleStartChat} />
        ) : (
          <EmptyMatch onStartMatching={handleStartMatching} />
        )}

        {/* Footer links */}
        <div className="pt-8 text-center space-x-4 text-sm text-subtext">
          <button className="hover:text-primary">이용약관</button>
          <span>|</span>
          <button className="hover:text-primary">개인정보처리방침</button>
          <span>|</span>
          <button className="hover:text-primary">고객지원</button>
        </div>
      </div>
    </MainLayout>
  )
} 