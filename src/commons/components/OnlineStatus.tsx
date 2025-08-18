import React from "react";

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: Date;
  size?: "sm" | "md" | "lg";
}

/**
 * 사용자의 온라인/오프라인 상태를 표시하는 컴포넌트
 * 초록색 원형 인디케이터(온라인) 또는 회색 원형 인디케이터(오프라인)를 표시합니다.
 */
const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  lastSeen,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const getStatusText = () => {
    if (isOnline) {
      return "온라인";
    }
    if (lastSeen) {
      return `마지막 활동: ${lastSeen.toLocaleString("ko-KR")}`;
    }
    return "오프라인";
  };

  return (
    <div className="flex items-center gap-2" title={getStatusText()}>
      <div
        className={`${sizeClasses[size]} rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
    </div>
  );
};

export default OnlineStatus; 