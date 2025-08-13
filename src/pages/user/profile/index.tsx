import React from "react"
import { ProfileEditForm } from "@/modules/user/components/auth/ProfileEditForm"
import { MainLayout } from "@/modules/user/components/layout/MainLayout"

export default function ProfileEditPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">회원 정보 수정</h1>
          <ProfileEditForm />
        </div>
      </div>
    </MainLayout>
  )
}
