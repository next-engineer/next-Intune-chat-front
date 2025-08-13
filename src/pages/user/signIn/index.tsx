import { LoginForm } from "@/modules/user/components/auth/LoginForm"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
} 