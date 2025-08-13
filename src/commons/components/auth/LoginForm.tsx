import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IntuneInput } from "@/commons/components/ui/intune-input"
import { IntuneButton } from "@/commons/components/ui/intune-button"
import { useAuthStore } from "@/stores/authStore"
import { User, Shield } from "lucide-react"
import { simpleHash } from "@/commons/utils/hashUtils"

// 테스트용 계정 데이터 (해시된 비밀번호)
const TEST_ACCOUNTS = [
  {
    name: "관리자",
    email: "admin@intune.com",
    passwordHash: "e10adc3949ba59abbe56e057f20f883e", // "123456" 해시
    salt: "admin_salt_123",
    isAdmin: true,
    description: "모든 기능 접근 가능"
  },
  {
    name: "일반 사용자",
    email: "user@intune.com", 
    passwordHash: "e10adc3949ba59abbe56e057f20f883e", // "123456" 해시
    salt: "user_salt_456",
    isAdmin: false,
    description: "기본 기능만 접근"
  },
  {
    name: "테스터1",
    email: "test1@example.com",
    passwordHash: "e10adc3949ba59abbe56e057f20f883e", // "123456" 해시
    salt: "test1_salt_789",
    isAdmin: false,
    description: "일반 사용자"
  },
  {
    name: "테스터2",
    email: "test2@example.com",
    passwordHash: "e10adc3949ba59abbe56e057f20f883e", // "123456" 해시
    salt: "test2_salt_012",
    isAdmin: false, 
    description: "일반 사용자"
  }
]

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>("")

  // 테스트 계정 적용 함수
  const applyTestAccount = (account: typeof TEST_ACCOUNTS[0]) => {
    setFormData({
      email: account.email,
      password: "", // 비밀번호는 사용자가 직접 입력해야 함
    })
    setErrors({})
    setLoginError("")
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (loginError) {
      setLoginError("")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setLoginError("")

    try {
      // 실제 API 호출 대신 모의 로그인 (개발용)
      // TODO: 실제 API 엔드포인트로 교체
      await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션
      
      // 테스트 계정에서 해당 이메일 찾기
      const testAccount = TEST_ACCOUNTS.find(account => account.email === formData.email)
      
      if (!testAccount) {
        throw new Error("계정을 찾을 수 없습니다.")
      }
      
      // 비밀번호 해시 검증
      const inputPasswordHash = simpleHash(formData.password)
      const isValidPassword = inputPasswordHash === testAccount.passwordHash
      
      if (!isValidPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.")
      }
      
      // 모의 사용자 데이터 (실제로는 API 응답에서 받아옴)
      const mockUser = {
        id: "user_" + Date.now(),
        email: formData.email,
        name: testAccount.name,
        isAdmin: testAccount.isAdmin
      }
      
      const mockToken = "mock_access_token_" + Date.now()
      const mockRefreshToken = "mock_refresh_token_" + Date.now()
      
      // 쿠키와 Zustand 상태에 로그인 정보 저장
      await setUser(mockUser, mockToken, mockRefreshToken)
      
      // 로그인 성공 후 홈페이지로 이동
      navigate('/')
      
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="text-subtext">Intune에 오신 것을 환영합니다</p>
      </div>

      {/* 로그인 에러 메시지 */}
      {loginError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{loginError}</p>
        </div>
      )}

      <IntuneInput
        label="이메일"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        required
        placeholder="example@email.com"
      />

      <IntuneInput
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
        placeholder="비밀번호를 입력하세요"
      />

      <IntuneButton type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </IntuneButton>

      <div className="space-y-4 text-center">
        <button type="button" className="text-sm text-primary hover:underline">
          비밀번호 찾기
        </button>

        <p className="text-sm text-subtext">
          아직 계정이 없으신가요?{" "}
          <button 
            type="button" 
            className="text-primary hover:underline"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </p>
      </div>
    </form>
  )
}
