import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../commons/components/layout/MainLayout';
import { useAuthStore } from '../../../stores/authStore';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Activity, 
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

// 더미 데이터
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalMatches: 3456,
  totalMessages: 15678,
  todayMatches: 45,
  todayMessages: 234,
  successRate: 87.5,
  avgResponseTime: 2.3
};

const mockRecentActivity = [
  {
    id: 1,
    type: 'match',
    user1: '김지민',
    user2: '박서연',
    time: '5분 전',
    status: 'success'
  },
  {
    id: 2,
    type: 'message',
    user: '이현우',
    content: '새로운 메시지',
    time: '12분 전',
    status: 'info'
  },
  {
    id: 3,
    type: 'user',
    user: '최수진',
    action: '회원가입',
    time: '23분 전',
    status: 'success'
  },
  {
    id: 4,
    type: 'report',
    user: '정민수',
    reason: '부적절한 행동',
    time: '1시간 전',
    status: 'warning'
  }
];

const mockTopUsers = [
  { id: 1, name: '김지민', matches: 45, rating: 4.8, status: 'online' },
  { id: 2, name: '박서연', matches: 38, rating: 4.7, status: 'online' },
  { id: 3, name: '이현우', matches: 32, rating: 4.6, status: 'offline' },
  { id: 4, name: '최수진', matches: 29, rating: 4.5, status: 'online' },
  { id: 5, name: '정민수', matches: 25, rating: 4.4, status: 'offline' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // 관리자 권한 확인
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">접근 권한을 확인하는 중...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">Intune 플랫폼의 전반적인 현황을 모니터링하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 ml-1">이번 주</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+8.3%</span>
              <span className="text-gray-500 ml-1">오늘</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 매칭</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalMatches.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+15.2%</span>
              <span className="text-gray-500 ml-1">이번 달</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 메시지</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalMessages.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+22.1%</span>
              <span className="text-gray-500 ml-1">이번 주</span>
            </div>
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 오늘의 통계 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘의 통계</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">새 매칭</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.todayMatches}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">새 메시지</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.todayMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">성공률</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">평균 응답시간</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.avgResponseTime}분</span>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {activity.type === 'match' && `${activity.user1} ↔ ${activity.user2}`}
                      {activity.type === 'message' && `${activity.user}: ${activity.content}`}
                      {activity.type === 'user' && `${activity.user} ${activity.action}`}
                      {activity.type === 'report' && `${activity.user}: ${activity.reason}`}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인기 사용자 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 사용자</h3>
            <div className="space-y-3">
              {mockTopUsers.map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{user.matches} 매칭</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{user.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 관리 도구 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">관리 도구</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700">사용자 관리</span>
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <span className="text-gray-700">신고 관리</span>
            </button>
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span className="text-gray-700">분석 도구</span>
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-6 w-6 text-gray-600" />
              <span className="text-gray-700">시스템 설정</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
