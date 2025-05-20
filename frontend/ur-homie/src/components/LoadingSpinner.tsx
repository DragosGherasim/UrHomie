import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "",
  size = 12,
  color = "blue-500",
}) => {
  const spinnerClass = `w-${size} h-${size} border-4 border-gray-300 border-t-${color} rounded-full animate-spin`;

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-screen">
      <div className={spinnerClass} />
      {text && <p className="text-gray-600 font-medium text-base">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
