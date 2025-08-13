import { IntuneButton } from "@/components/ui/intune-button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface EmptyMatchProps {
  onStartMatching: () => void
}

export function EmptyMatch({ onStartMatching }: EmptyMatchProps) {
  return (
    <Card className="bg-soft rounded-intune shadow-intune border-0">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">아직 오늘의 매칭이 없습니다</h3>
          <p className="text-sm text-subtext">매칭 시작 버튼을 눌러주세요</p>
        </div>

        <IntuneButton onClick={onStartMatching} className="w-full">
          매칭 시작
        </IntuneButton>
      </CardContent>
    </Card>
  )
}
