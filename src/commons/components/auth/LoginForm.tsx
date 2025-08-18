import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IntuneInput } from "@/commons/components/ui/intune-input";
import { IntuneButton } from "@/commons/components/ui/intune-button";
import { userApi } from "@/modules/user/apis";
import { useAuthStore } from "@/stores/authStore";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      // API를 통한 로그인 시도
      const user = await userApi.signIn({
        email: formData.email,
        password: formData.password,
      });
      
      // 로그인 성공 시 인증 스토어 업데이트
      setAuthenticated(user);
      
      // 쿠키 설정
      document.cookie = `access_token=${user.token}; path=/`;
      document.cookie = `user_email=${user.email}; path=/`;
      document.cookie = `is_admin=${user.isAdmin}; path=/`;
      
      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(user));
      
      // 홈페이지로 리다이렉트
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </p>
      </div>
    </form>
  );
}
