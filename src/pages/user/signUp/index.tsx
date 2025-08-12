import { SignupForm } from "@/commons/components/auth/SignupForm"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
} 