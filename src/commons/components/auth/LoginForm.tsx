import type React from "react"
import { useState } from "react"
import { IntuneInput } from "@/commons/components/ui/intune-input"
import { IntuneButton } from "@/commons/components/ui/intune-button"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement INTUNE-API-03
      console.log("Login data:", formData)
      // JWT 발급 후 홈 화면 이동
    } catch (error) {
      console.error("Login error:", error)
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

      <IntuneInput
        label="이메일"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <IntuneInput
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
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
          <button type="button" className="text-primary hover:underline">
            회원가입
          </button>
        </p>
      </div>
    </form>
  )
}
