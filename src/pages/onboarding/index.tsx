import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntuneButton } from '@/commons/components/ui/intune-button';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Users, Shield, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboardingStore';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Intune에 오신 것을 환영합니다!",
    description: "새로운 사람들과 만나고 의미 있는 대화를 나누는 특별한 공간입니다.",
    icon: <Heart className="w-16 h-16 text-primary" />,
  },
  {
    id: 2,
    title: "MBTI 기반 매칭",
    description: "당신의 성향에 맞는 사람들과 매칭되어 더 깊이 있는 대화를 경험하세요.",
    icon: <Users className="w-16 h-16 text-primary" />,
  },
  {
    id: 3,
    title: "실시간 채팅",
    description: "매칭된 상대와 실시간으로 대화하며 서로를 알아가보세요.",
    icon: <MessageCircle className="w-16 h-16 text-primary" />,
  },
  {
    id: 4,
    title: "안전한 환경",
    description: "개인정보 보호와 안전한 대화 환경을 제공합니다.",
    icon: <Shield className="w-16 h-16 text-primary" />,
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { setHasSeenOnboarding } = useOnboardingStore();

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSignUp = () => {
    setHasSeenOnboarding(true);
    navigate('/signup');
  };

  const goToSignIn = () => {
    setHasSeenOnboarding(true);
    navigate('/signin');
  };

  const skipOnboarding = () => {
    setHasSeenOnboarding(true);
    navigate('/');
  };

  const currentSlideData = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">Intune</h1>
        </div>
        <button
          onClick={skipOnboarding}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          건너뛰기
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
        {/* 슬라이드 콘텐츠 */}
        <div className="text-center max-w-md mx-auto">
          {/* 아이콘 */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              {currentSlideData.icon}
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {currentSlideData.title}
          </h2>

          {/* 설명 */}
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentSlideData.description}
          </p>
        </div>

        {/* 진행 표시기 */}
        <div className="flex space-x-2 mt-12 mb-8">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex items-center space-x-4">
          {/* 이전 버튼 */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {/* 다음/시작 버튼 */}
          {!isLastSlide ? (
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-primary shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          ) : (
            <IntuneButton
              onClick={goToSignUp}
              size="lg"
              className="px-8"
            >
              시작하기
              <ArrowRight className="w-5 h-5" />
            </IntuneButton>
          )}
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="p-6">
        <div className="flex flex-col space-y-3">
          <IntuneButton
            onClick={goToSignUp}
            size="lg"
            className="w-full"
          >
            회원가입
          </IntuneButton>
          
          <IntuneButton
            onClick={goToSignIn}
            variant="outline"
            size="lg"
            className="w-full"
          >
            로그인
          </IntuneButton>
        </div>
      </div>
    </div>
  );
}
