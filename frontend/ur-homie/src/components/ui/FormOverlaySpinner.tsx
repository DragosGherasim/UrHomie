import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface FormOverlaySpinnerProps {
  text?: string;
  color?: "green" | "blue" | "red" | "gray";
  size?: "sm" | "md" | "lg";
}

const FormOverlaySpinner: React.FC<FormOverlaySpinnerProps> = ({
  text = "Please wait...",
  color = "green",
  size = "md",
}) => {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
      <LoadingSpinner text={text} color={color} size={size} />
    </div>
  );
};

export default FormOverlaySpinner;