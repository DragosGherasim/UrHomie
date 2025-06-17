import React from "react";
import GenericHeroLayout from "../../../../shared/components/layout/GenericLayout";
import HomeNav from "../../../../shared/components/layout/HomeNav";
import heroClient from "../../../../assets/images/hero-client.png";
import heroServiceProvider from "../../../../assets/images/hero-serv-prov.png";
import { useAuth } from "../../../../shared/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

const ServiceDetailsLayout: React.FC<Props> = ({ children }) => {
  const { role } = useAuth();

  const backgroundImage = role === "client" ? heroClient : heroServiceProvider;

  return (
    <GenericHeroLayout
      backgroundImage={backgroundImage}
      nav={<HomeNav role={role} />}
      overlayClassName="bg-black/50 backdrop-blur-sm"
    >
      {children}
    </GenericHeroLayout>
  );
};

export default ServiceDetailsLayout;
