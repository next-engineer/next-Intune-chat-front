import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../commons/components/layout/MainLayout';
import { useAuthStore } from '../../../stores/authStore';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  MapPin,
  Star
} from 'lucide-react';

// 더미 사용자 데이터
const mockUsers = [
  {
    id: 1,
    name: '김지민',
    email: 'jimin@example.com',
    mbti: 'ENFP',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20 14:30',
    matches: 45,
    rating: 4.8,
    location: '서울시 강남구',
    isVerified: true,
    isAdmin: false
  },
  {
    id: 2,
    name: '박서연',
    email: 'seoyeon@example.com',
    mbti: 'INFJ',
    status: 'active',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-20 15:45',
    matches: 38,
    rating: 4.7,
    location: '서울시 서초구',
    isVerified: true,
    isAdmin: false
  },
  {
    id: 3,
    name: '이현우',
    email: 'hyunwoo@example.com',
    mbti: 'ISTJ',
    status: 'suspended',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-18 09:20',
    matches: 32,
    rating: 4.6,
    location: '부산시 해운대구',
    isVerified: false,
    isAdmin: false
  },
  {
    id: 4,
    name: '최수진',
    email: 'sujin@example.com',
    mbti: 'INFP',
    status: 'active',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-20 16:15',
    matches: 29,
    rating: 4.5,
    location: '대구시 수성구',
    isVerified: true,
    isAdmin: false
  },
  {
    id: 5,
    name: '정민수',
    email: 'minsu@example.com',
    mbti: 'ESTP',
    status: 'banned',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-17 11:30',
    matches: 25,
    rating: 4.4,
    location: '인천시 연수구',
    isVerified: false,
    isAdmin: false
  },
  {
    id: 6,
    name: '관리자',
    email: 'admin@intune.com',
    mbti: 'INTJ',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-20 17:00',
    matches: 0,
    rating: 5.0,
    location: '서울시 강남구',
    isVerified: true,
    isAdmin: true
  }
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

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

  // 검색 및 필터링
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mbti.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 사용자 상태 변경
  const updateUserStatus = (userId: number, newStatus: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // 사용자 삭제
  const deleteUser = (userId: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  // 사용자 상세 정보 모달
  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">사용자 관리</h1>
              <p className="text-gray-600">전체 {users.length}명의 사용자를 관리하세요</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 이메일, MBTI로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체 상태</option>
                <option value="active">활성</option>
                <option value="suspended">정지</option>
                <option value="banned">차단</option>
              </select>
            </div>
          </div>
        </div>

        {/* 사용자 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    매칭/평점
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    최근 로그인
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            {user.isVerified && <Shield className="h-4 w-4 text-blue-500" />}
                            {user.isAdmin && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">관리자</span>}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{user.mbti}</span>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? '활성' :
                         user.status === 'suspended' ? '정지' : '차단'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{user.matches} 매칭</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-900">{user.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* 편집 기능 */}}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 사용자 상세 모달 */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">사용자 상세 정보</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">MBTI</p>
                    <p className="font-medium">{selectedUser.mbti}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">상태</p>
                    <p className="font-medium">{selectedUser.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">매칭 수</p>
                    <p className="font-medium">{selectedUser.matches}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">평점</p>
                    <p className="font-medium">{selectedUser.rating}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">가입일</p>
                    <p className="font-medium">{new Date(selectedUser.joinDate).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">위치</p>
                    <p className="font-medium">{selectedUser.location}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => {/* 메시지 보내기 */}}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Mail className="h-4 w-4 inline mr-2" />
                    메시지
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
