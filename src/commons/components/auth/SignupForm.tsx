import type React from "react"
import { useState } from "react"
import { IntuneInput } from "@/commons/components/ui/intune-input"
import { IntuneButton } from "@/commons/components/ui/intune-button"
import { MBTISelector } from "@/commons/components/ui/mbti-selector"
import { Label } from "@/commons/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/commons/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { Upload, Check } from "lucide-react"

interface SignupFormData {
  email: string
  password: string
  nickname: string
  gender: "M" | "F" | ""
  address: string
  mbti: string
  profileImage?: File
}

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    address: "",
    mbti: "",
  })

  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [emailChecked, setEmailChecked] = useState(false)
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string>("")

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => setProfilePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const checkEmailDuplicate = async () => {
    // TODO: Implement INTUNE-API-08
    setEmailChecked(true)
  }

  const checkNicknameDuplicate = async () => {
    // TODO: Implement INTUNE-API-09
    setNicknameChecked(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement INTUNE-API-01
    console.log("Signup data:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="text-subtext">Intune에서 새로운 인연을 만나보세요</p>
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">프로필 이미지</Label>
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profilePreview || "/placeholder.svg"} />
            <AvatarFallback>
              <Upload className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <IntuneButton type="button" variant="outline" size="sm">
              이미지 선택
            </IntuneButton>
          </label>
        </div>
      </div>

      {/* Email with duplicate check */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <IntuneInput
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            success={emailChecked ? "사용 가능한 이메일입니다" : ""}
            required
          />
        </div>
        <IntuneButton type="button" variant="outline" size="sm" onClick={checkEmailDuplicate} className="mt-7">
          {emailChecked ? <Check className="w-4 h-4" /> : "중복확인"}
        </IntuneButton>
      </div>

      <IntuneInput
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
      />

      {/* Nickname with duplicate check */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <IntuneInput
            label="닉네임"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            error={errors.nickname}
            success={nicknameChecked ? "사용 가능한 닉네임입니다" : ""}
            required
          />
        </div>
        <IntuneButton type="button" variant="outline" size="sm" onClick={checkNicknameDuplicate} className="mt-7">
          {nicknameChecked ? <Check className="w-4 h-4" /> : "중복확인"}
        </IntuneButton>
      </div>

      {/* Gender Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">
          성별 <span className="text-danger">*</span>
        </Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          className="flex space-x-6"
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
      </div>

      <IntuneInput
        label="주소"
        value={formData.address}
        onChange={(e) => handleInputChange("address", e.target.value)}
        placeholder="우편번호 검색을 통해 입력해주세요"
        error={errors.address}
        required
      />

      {/* MBTI Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">
          MBTI <span className="text-danger">*</span>
        </Label>
        <MBTISelector
          value={formData.mbti}
          onChange={(value) => handleInputChange("mbti", value)}
          error={errors.mbti}
        />
      </div>

      <IntuneButton type="submit" className="w-full" size="lg">
        가입하기
      </IntuneButton>

      <div className="text-center">
        <p className="text-sm text-subtext">
          이미 계정이 있으신가요?{" "}
          <button type="button" className="text-primary hover:underline">
            로그인
          </button>
        </p>
      </div>
    </form>
  )
}
