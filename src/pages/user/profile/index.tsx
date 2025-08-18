import React from 'react';
import { ProfileEditForm } from '@/commons/components/user/ProfileEditForm';
import { MainLayout } from '@/commons/components/layout/MainLayout';

const ProfileEditPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">회원정보 수정</h1>
            <p className="text-gray-600 dark:text-gray-300">
              개인정보를 안전하게 관리하고 업데이트할 수 있습니다.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ProfileEditForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileEditPage;
