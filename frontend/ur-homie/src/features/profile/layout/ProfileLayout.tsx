import GenericHeroLayout from "../../../shared/components/layout/GenericLayout";
import HomeNav from "../../../shared/components/layout/HomeNav";
import { useAuth } from "../../../shared/context/AuthContext";

import heroClient from "../../../assets/images/hero-client.png";
import heroProvider from "../../../assets/images/hero-serv-prov.png";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAuth();
  const backgroundImage = role === "client" ? heroClient : heroProvider;

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

export default ProfileLayout;
