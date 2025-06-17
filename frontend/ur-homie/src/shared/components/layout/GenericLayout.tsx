import React from "react";

interface GenericHeroLayoutProps {
  backgroundImage: string;
  nav: React.ReactNode;
  children: React.ReactNode;
  overlayClassName?: string;
}

const GenericHeroLayout: React.FC<GenericHeroLayoutProps> = ({
  backgroundImage,
  nav,
  children,
  overlayClassName = "bg-transparent",
}) => {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-[center_40%]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={`absolute inset-0 ${overlayClassName} z-0`} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="h-16 bg-white/60 backdrop-blur-sm shadow-sm z-10 flex items-center">
          {nav}
        </header>

        <main className="flex-1 px-4 pt-10 pb-16 flex justify-center items-start overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GenericHeroLayout;