import type React from "react"
import { useState, useEffect } from "react"
import { IntuneInput } from "@/components/ui/intune-input"
import { IntuneButton } from "@/components/ui/intune-button"
import { MBTISelector } from "@/components/ui/mbti-selector"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Check, X, Loader2, User, Save, ArrowLeft } from "lucide-react"
import { userApi } from "@/modules/user/apis"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

interface ProfileEditFormData {
  email: string
  nickname: string
  gender: "M" | "F" | ""
  address: string
  mbti: string
  profileImage?: File
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  nickname?: string
  gender?: string
  address?: string
  mbti?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export function ProfileEditForm() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  
  const [formData, setFormData] = useState<ProfileEditFormData>({
    email: "",
    nickname: "",
    gender: "",
    address: "",
    mbti: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordChange, setIsPasswordChange] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 현재 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        nickname: user.nickname || "",
        gender: user.gender || "",
        address: user.address || "",
        mbti: user.mbti || "",
      }))
      if (user.profileImage) {
        setImagePreview(user.profileImage)
      }
    }
  }, [user])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요"
    }

    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요"
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다"
    }

    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요"
    }

    if (!formData.address) {
      newErrors.address = "주소를 입력해주세요"
    }

    if (!formData.mbti) {
      newErrors.mbti = "MBTI를 선택해주세요"
    }

    // 비밀번호 변경 시에만 검증
    if (isPasswordChange) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "현재 비밀번호를 입력해주세요"
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "새 비밀번호를 입력해주세요"
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "비밀번호는 6자 이상이어야 합니다"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호 확인을 입력해주세요"
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ProfileEditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다")
        return
      }
      
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const updateData: any = {
        email: formData.email,
        nickname: formData.nickname,
        gender: formData.gender,
        address: formData.address,
        mbti: formData.mbti,
      }

      if (isPasswordChange) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      if (selectedFile) {
        updateData.profileImage = selectedFile
      }

      // API 호출 (실제 구현 시 userApi.updateProfile 사용)
      // const response = await userApi.updateProfile(updateData)
      
      // 테스트용 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = {
        ...user,
        email: formData.email,
        nickname: formData.nickname,
        gender: formData.gender,
        address: formData.address,
        mbti: formData.mbti,
        profileImage: imagePreview
      }
      
      updateUser(updatedUser)
      
      alert("회원 정보가 성공적으로 수정되었습니다!")
      navigate("/home")
      
    } catch (error) {
      console.error("회원 정보 수정 실패:", error)
      alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          뒤로가기
        </button>
        <h2 className="text-xl font-semibold">프로필 수정</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview} alt="프로필 이미지" />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">클릭하여 프로필 이미지를 변경하세요</p>
        </div>

        {/* 이메일 */}
        <div>
          <Label htmlFor="email">이메일</Label>
          <IntuneInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="이메일을 입력하세요"
            error={errors.email}
          />
        </div>

        {/* 닉네임 */}
        <div>
          <Label htmlFor="nickname">닉네임</Label>
          <IntuneInput
            id="nickname"
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            placeholder="닉네임을 입력하세요"
            error={errors.nickname}
          />
        </div>

        {/* 성별 */}
        <div>
          <Label>성별</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="male" />
              <Label htmlFor="male">남성</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="female" />
              <Label htmlFor="female">여성</Label>
            </div>
          </RadioGroup>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        {/* 주소 */}
        <div>
          <Label htmlFor="address">주소</Label>
          <IntuneInput
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="주소를 입력하세요"
            error={errors.address}
          />
        </div>

        {/* MBTI */}
        <div>
          <Label>MBTI</Label>
          <MBTISelector
            value={formData.mbti}
            onChange={(value) => handleInputChange("mbti", value)}
          />
          {errors.mbti && <p className="text-red-500 text-sm mt-1">{errors.mbti}</p>}
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">비밀번호 변경</h3>
            <button
              type="button"
              onClick={() => setIsPasswordChange(!isPasswordChange)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              {isPasswordChange ? "취소" : "변경하기"}
            </button>
          </div>

          {isPasswordChange && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <IntuneInput
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  error={errors.currentPassword}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <IntuneInput
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  error={errors.newPassword}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <IntuneInput
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex space-x-4 pt-6">
          <IntuneButton
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
            disabled={isLoading}
          >
            취소
          </IntuneButton>
          <IntuneButton
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                수정 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                정보 수정
              </>
            )}
          </IntuneButton>
        </div>
      </form>
    </div>
  )
}
