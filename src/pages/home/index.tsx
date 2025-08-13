import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/commons/components/layout/MainLayout"
import { MatchCard } from "@/commons/components/home/MatchCard"
import { EmptyMatch } from "@/commons/components/home/EmptyMatch"
import { useAuthStore } from "@/stores/authStore"

// Mock data - replace with actual API call
const mockTodayMatch = {
  id: "1",
  nickname: "민지",
  mbti: "ENFP",
  profileImage: "/friendly-woman.png",
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [hasMatch, setHasMatch] = useState(false)
  const [todayMatch, setTodayMatch] = useState(mockTodayMatch)

  // 로그인 상태 확인
  useEffect(() => {
    if (!isAuthenticated) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/signin')
    }
  }, [isAuthenticated, navigate])

  const handleStartMatching = () => {
    // Navigate to matching page instead of inline matching
    navigate("/matching")
  }

  const handleStartChat = () => {
    // TODO: Navigate to chat with matched user
    console.log("Starting chat with:", todayMatch.id)
    navigate(`/chat/${todayMatch.id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">인증 상태를 확인하는 중...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout user={user}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">오늘의 매칭</h1>
          <p className="text-subtext dark:text-gray-400">결이 닮은 사람과, 마음이 닿는 매칭</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">안녕하세요, {user.name}님! 👋</p>
        </div>

        {hasMatch ? (
          <MatchCard user={todayMatch} onStartChat={handleStartChat} />
        ) : (
          <EmptyMatch onStartMatching={handleStartMatching} />
        )}

        {/* 로그아웃 버튼 */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* Footer links */}
        <div className="pt-8 text-center space-x-4 text-sm text-subtext dark:text-gray-400">
          <button className="hover:text-primary dark:hover:text-blue-400">이용약관</button>
          <span>|</span>
          <button className="hover:text-primary dark:hover:text-blue-400">개인정보처리방침</button>
          <span>|</span>
          <button className="hover:text-primary dark:hover:text-blue-400">고객지원</button>
        </div>
      </div>
    </MainLayout>
  )
} 