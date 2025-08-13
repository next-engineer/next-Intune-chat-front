import type React from "react"
import { useState } from "react"
import { IntuneInput } from "@/commons/components/ui/intune-input"
import { IntuneButton } from "@/commons/components/ui/intune-button"
import { MBTISelector } from "@/commons/components/ui/mbti-selector"
import { Label } from "@/commons/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/commons/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/commons/components/ui/avatar"
import { Upload, Check, X, Loader2 } from "lucide-react"
import { userApi } from "@/modules/user/apis"
import { hashPassword } from "@/commons/utils/hashUtils"

interface SignupFormData {
  email: string
  password: string
  nickname: string
  gender: "M" | "F" | ""
  address: string
  mbti: string
  profileImage?: File
}

interface FormErrors {
  email?: string
  password?: string
  nickname?: string
  gender?: string
  address?: string
  mbti?: string
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

  const [errors, setErrors] = useState<FormErrors>({})
  const [emailChecked, setEmailChecked] = useState(false)
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null)
  const [emailChecking, setEmailChecking] = useState(false)
  const [nicknameChecking, setNicknameChecking] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string>("")



  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field !== 'profileImage' && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    
    // 이메일이나 닉네임이 변경되면 중복 체크 상태 초기화
    if (field === "email") {
      setEmailChecked(false)
      setEmailAvailable(null)
    }
    if (field === "nickname") {
      setNicknameChecked(false)
      setNicknameAvailable(null)
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateNickname = (nickname: string): boolean => {
    return nickname.length >= 2 && nickname.length <= 20
  }

  const checkEmailDuplicate = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }))
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식을 입력해주세요." }))
      return
    }

    setEmailChecking(true)
    setErrors((prev) => ({ ...prev, email: "" }))

    try {
      const response = await userApi.checkEmailDuplicate(formData.email)
      setEmailAvailable(response.isAvailable)
      setEmailChecked(true)
      
      if (!response.isAvailable) {
        setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }))
      }
    } catch (error: any) {
      console.error("이메일 중복 체크 실패:", error)
      setErrors((prev) => ({ 
        ...prev, 
        email: error.message || "이메일 중복 확인에 실패했습니다. 다시 시도해주세요." 
      }))
      setEmailAvailable(false)
      setEmailChecked(false)
    } finally {
      setEmailChecking(false)
    }
  }

  const checkNicknameDuplicate = async () => {
    if (!formData.nickname) {
      setErrors((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }))
      return
    }

    if (!validateNickname(formData.nickname)) {
      setErrors((prev) => ({ ...prev, nickname: "닉네임은 2~20자 사이로 입력해주세요." }))
      return
    }

    setNicknameChecking(true)
    setErrors((prev) => ({ ...prev, nickname: "" }))

    try {
      const response = await userApi.checkNicknameDuplicate(formData.nickname)
      setNicknameAvailable(response.isAvailable)
      setNicknameChecked(true)
      
      if (!response.isAvailable) {
        setErrors((prev) => ({ ...prev, nickname: "이미 사용 중인 닉네임입니다." }))
      }
    } catch (error: any) {
      console.error("닉네임 중복 체크 실패:", error)
      setErrors((prev) => ({ 
        ...prev, 
        nickname: error.message || "닉네임 중복 확인에 실패했습니다. 다시 시도해주세요." 
      }))
      setNicknameAvailable(false)
      setNicknameChecked(false)
    } finally {
      setNicknameChecking(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요."
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요."
    } else if (!emailChecked) {
      newErrors.email = "이메일 중복 확인을 해주세요."
    } else if (emailAvailable === false) {
      newErrors.email = "사용할 수 없는 이메일입니다."
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요."
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다."
    }

    // 닉네임 검증
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요."
    } else if (!validateNickname(formData.nickname)) {
      newErrors.nickname = "닉네임은 2~20자 사이로 입력해주세요."
    } else if (!nicknameChecked) {
      newErrors.nickname = "닉네임 중복 확인을 해주세요."
    } else if (nicknameAvailable === false) {
      newErrors.nickname = "사용할 수 없는 닉네임입니다."
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요."
    }

    // 주소 검증
    if (!formData.address) {
      newErrors.address = "주소를 입력해주세요."
    }

    // MBTI 검증
    if (!formData.mbti) {
      newErrors.mbti = "MBTI를 선택해주세요."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // 비밀번호 해싱
      const { hash: passwordHash, salt } = await hashPassword(formData.password)
      
      // 회원가입 데이터 준비 (해시된 비밀번호 포함)
      const signupData = {
        ...formData,
        password: passwordHash, // 해시된 비밀번호로 교체
        salt: salt, // 솔트 추가
      }
      
      // TODO: Implement INTUNE-API-01
      console.log("Signup data with hashed password:", signupData)
      
      // 실제 API 호출 시에는 해시된 비밀번호와 솔트를 서버로 전송
      // await userApi.signup(signupData)
      
    } catch (error) {
      console.error("Signup error:", error)
    }
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
            success={emailAvailable === true ? "사용 가능한 이메일입니다" : ""}
            required
            placeholder="example@email.com"
          />
        </div>
        <IntuneButton 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={checkEmailDuplicate} 
          className="mt-7"
          disabled={emailChecking}
        >
          {emailChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : emailChecked ? (
            emailAvailable === true ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-600" />
            )
          ) : (
            "중복확인"
          )}
        </IntuneButton>
      </div>

      <IntuneInput
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
        placeholder="비밀번호를 입력하세요"
      />

      {/* Nickname with duplicate check */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <IntuneInput
            label="닉네임"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            error={errors.nickname}
            success={nicknameAvailable === true ? "사용 가능한 닉네임입니다" : ""}
            required
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <IntuneButton 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={checkNicknameDuplicate} 
          className="mt-7"
          disabled={nicknameChecking}
        >
          {nicknameChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : nicknameChecked ? (
            nicknameAvailable === true ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-600" />
            )
          ) : (
            "중복확인"
          )}
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
        {errors.gender && (
          <p className="text-sm text-red-600">{errors.gender}</p>
        )}
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
        />
        {errors.mbti && (
          <p className="text-sm text-red-600">{errors.mbti}</p>
        )}
      </div>

      <IntuneButton type="submit" className="w-full" size="lg">
        회원가입
      </IntuneButton>

      <div className="text-center">
        <p className="text-sm text-subtext">
          이미 계정이 있으신가요?{" "}
          <button 
            type="button" 
            className="text-primary hover:underline"
            onClick={() => window.location.href = '/signin'}
          >
            로그인
          </button>
        </p>
      </div>
    </form>
  )
}
