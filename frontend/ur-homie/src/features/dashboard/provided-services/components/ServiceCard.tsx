import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  city: string;
  address: string;
  basePrice: string;
  durationEstimate: string;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imageUrl,
  city,
  address,
  basePrice,
  durationEstimate,
  onClick,
}) => {
  let imageSrc: string;
  try {
    const imageFile = imageUrl.split("/").pop();
    imageSrc = require(`../../../../assets/images/categories/${imageFile}`);
  } catch (error) {
    console.error("Image not found for:", imageUrl);
    imageSrc = "";
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
    >
      <img src={imageSrc} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-sm text-gray-600">
          {city}, {address}
        </p>
        <div className="text-sm text-gray-700 font-medium">
          {basePrice} RON · {durationEstimate}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;