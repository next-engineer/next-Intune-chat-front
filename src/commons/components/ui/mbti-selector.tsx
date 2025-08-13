import { cn } from "@/commons/utils"

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]

interface MBTISelectorProps {
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export function MBTISelector({ value, onChange, error }: MBTISelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {MBTI_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange?.(type)}
            className={cn(
              "p-3 text-sm font-medium rounded-intune border-2 transition-all min-h-touch",
              value === type
                ? "border-primary bg-primary text-white"
                : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary",
            )}
          >
            {type}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
