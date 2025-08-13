import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { IntuneInput } from '@/commons/components/ui/intune-input';
import { IntuneButton } from '@/commons/components/ui/intune-button';
import { Label } from '@/commons/components/ui/label';
import { MBTISelector } from '@/commons/components/ui/mbti-selector';
import { RadioGroup, RadioGroupItem } from '@/commons/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/commons/components/ui/avatar';
import { Upload, Check, X, Loader2, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { hashPassword } from '@/commons/utils/hashUtils';


interface ProfileFormData {
  email: string;
  name: string;
  nickname: string;
  gender: "M" | "F" | "";
  address: string;
  mbti: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  profileImage?: File;
}

interface FormErrors {
  email?: string;
  name?: string;
  nickname?: string;
  gender?: string;
  address?: string;
  mbti?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function ProfileEditForm() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    name: "",
    nickname: "",
    gender: "",
    address: "",
    mbti: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: user.name,
        nickname: user.name, // 기본값으로 이름 사용
        gender: "M", // 기본값
        address: "서울시 강남구", // 기본값
        mbti: "ENFP", // 기본값
      }));
      
      // 기존 프로필 이미지가 있다면 미리보기로 설정
      if (user.avatar) {
        setProfilePreview(user.avatar);
      }
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 정확한 파일 형식 검증 (MIME 타입 + 확장자)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ["png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // MIME 타입과 확장자 모두 검증
    if (!allowedMimeTypes.includes(file.type) || !fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert("PNG 또는 JPG 형식의 파일만 업로드할 수 있습니다.");
      return;
    }

    setFormData(prev => ({ ...prev, profileImage: file }));
    const reader = new FileReader();
    reader.onload = (e) => setProfilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, profileImage: undefined }));
    setProfilePreview("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNickname = (nickname: string): boolean => {
    return nickname.length >= 2 && nickname.length <= 20;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.length < 2) {
      newErrors.name = "이름은 최소 2자 이상이어야 합니다.";
    }

    // 닉네임 검증
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (!validateNickname(formData.nickname)) {
      newErrors.nickname = "닉네임은 2~20자 사이로 입력해주세요.";
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    // 주소 검증
    if (!formData.address) {
      newErrors.address = "주소를 입력해주세요.";
    }

    // MBTI 검증
    if (!formData.mbti) {
      newErrors.mbti = "MBTI를 선택해주세요.";
    }

    // 비밀번호 변경 섹션이 활성화된 경우
    if (showPasswordSection) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
      }

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          newErrors.newPassword = "새 비밀번호는 최소 6자 이상이어야 합니다.";
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    try {
      // 실제 API 호출 대신 모의 저장 (개발용)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 비밀번호 변경이 있는 경우 해싱
      let hashedNewPassword = null;
      if (showPasswordSection && formData.newPassword) {
        const { hash } = await hashPassword(formData.newPassword);
        hashedNewPassword = hash;
      }

      // 사용자 정보 업데이트 (User 타입에 맞게)
      const updatedUser = {
        id: user!.id,
        email: formData.email,
        name: formData.name,
        avatar: profilePreview || user!.avatar, // 프로필 이미지 업데이트
        isAdmin: user!.isAdmin,
      };

      // 새로운 토큰 생성 (실제로는 서버에서 받아옴)
      const newToken = "updated_access_token_" + Date.now();
      const newRefreshToken = "updated_refresh_token_" + Date.now();

      // Zustand 상태 업데이트
      await setUser(updatedUser, newToken, newRefreshToken);

      setSuccessMessage("회원정보가 성공적으로 수정되었습니다!");
      
      // 비밀번호 변경 후 폼 초기화
      if (showPasswordSection) {
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setShowPasswordSection(false);
      }

    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({ email: "회원정보 수정에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 성공 메시지 */}
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
          </div>
        )}

        {/* 프로필 이미지 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-white">프로필 이미지</Label>
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profilePreview || "/placeholder.svg"} />
                <AvatarFallback>
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </AvatarFallback>
              </Avatar>
              {profilePreview && (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="이미지 제거"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageUpload} className="hidden" />
                <IntuneButton type="button" variant="outline" size="sm">
                  이미지 변경
                </IntuneButton>
              </label>
              {profilePreview && (
                <IntuneButton 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleImageRemove}
                  className="text-red-600 hover:text-red-700"
                >
                  이미지 제거
                </IntuneButton>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              JPG, PNG 형식, 최대 5MB
            </p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="이름"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
            placeholder="이름을 입력하세요"
          />
        </div>

        <IntuneInput
          label="닉네임"
          value={formData.nickname}
          onChange={(e) => handleInputChange("nickname", e.target.value)}
          error={errors.nickname}
          required
          placeholder="닉네임을 입력하세요"
        />

        {/* 성별 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-white">
            성별 <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex space-x-6"
          >
                         <div className="flex items-center space-x-2">
               <RadioGroupItem value="M" id="male" />
               <Label htmlFor="male" className="text-gray-900 dark:text-white">남성</Label>
             </div>
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="F" id="female" />
               <Label htmlFor="female" className="text-gray-900 dark:text-white">여성</Label>
             </div>
          </RadioGroup>
          {errors.gender && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
          )}
        </div>

        <IntuneInput
          label="주소"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="주소를 입력해주세요"
          error={errors.address}
          required
        />

        {/* MBTI 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-white">
            MBTI <span className="text-red-500">*</span>
          </Label>
          <MBTISelector
            value={formData.mbti}
            onChange={(value) => handleInputChange("mbti", value)}
          />
          {errors.mbti && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.mbti}</p>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">비밀번호 변경</h3>
            <IntuneButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? "취소" : "비밀번호 변경"}
            </IntuneButton>
          </div>

          {showPasswordSection && (
            <div className="space-y-4">
              <IntuneInput
                label="현재 비밀번호"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                error={errors.currentPassword}
                placeholder="현재 비밀번호를 입력하세요"
              />

              <IntuneInput
                label="새 비밀번호"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                error={errors.newPassword}
                placeholder="새 비밀번호를 입력하세요"
              />

              <IntuneInput
                label="새 비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
          )}
        </div>




        {/* 저장 버튼 */}
        <div className="flex gap-4 pt-6">
          <IntuneButton
            type="submit"
            className="flex-1"
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </IntuneButton>

          <IntuneButton
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
          >
            취소
          </IntuneButton>
        </div>
      </form>
    </div>
  );
}
