import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "red" | "gray";
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const colorMap: Record<NonNullable<LoadingSpinnerProps["color"]>, string> = {
  blue: "border-t-blue-500",
  green: "border-t-green-500",
  red: "border-t-red-500",
  gray: "border-t-gray-500",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "",
  size = "md",
  color = "blue",
}) => {
  const spinnerClass = `border-4 border-gray-300 rounded-full animate-spin ${sizeMap[size]} ${colorMap[color]}`;

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-screen">
      <div className={spinnerClass} />
      {text && <p className="text-gray-600 font-medium text-base">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
